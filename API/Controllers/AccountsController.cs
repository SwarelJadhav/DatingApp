using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using API.Data;
using System.Threading.Tasks;
using System.Security.Cryptography;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using AutoMapper;

namespace API.Controllers
{
    public class AccountsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _token;
        private readonly IMapper _mapper;
        public AccountsController(DataContext context, ITokenService token, IMapper mapper)
        {
            _token = token;
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTOs resgisterDTO)
        {
            if (await UserExists(resgisterDTO.username))
            {
                return BadRequest("User is taken");
            }
            var user = _mapper.Map<AppUser>(resgisterDTO);
            using var hmac = new HMACSHA512();
            user.UserName = resgisterDTO.username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(resgisterDTO.password));
            user.PasswordSalt = hmac.Key;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDTO
            {
                Username = user.UserName,
                Token = _token.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == loginDTO.Username);
            if (user == null)
            {
                return Unauthorized("Invalid user name");
            }
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computehash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));
            for (int i = 0; i < computehash.Length; i++)
            {
                if (computehash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Invalid password");
                }
            }
            return new UserDTO
            {
                Username = user.UserName,
                Token = _token.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs=user.KnownAs
            };
        }
    }
}