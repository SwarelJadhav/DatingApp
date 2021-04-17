using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using API.Data;
using System.Threading.Tasks;
using System.Security.Cryptography;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;

namespace API.Controllers
{
    public class AccountsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _token;
        public AccountsController(DataContext context, ITokenService token)
        {
            _token = token;
            _context = context;

        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register([FromQuery] RegisterDTOs resgisterDTO)
        {
            if (await UserExists(resgisterDTO.username))
            {
                return BadRequest("User is taken");
            }
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = resgisterDTO.username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(resgisterDTO.password)),
                PasswordSalt = hmac.Key
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDTO{
                Username=user.UserName,
                Token=_token.CreateToken(user)
            };
        }
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login([FromQuery] LoginDTO loginDTO)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDTO.Username);
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
            return new UserDTO{
                Username=user.UserName,
                Token=_token.CreateToken(user)
            };
        }
    }
}