using API.Data;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.DTOs;
using AutoMapper;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository,IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task< ActionResult<IEnumerable<MemberDTO>>> GetUsers(){
            var users = await _userRepository.GetMembersAsync();
             return Ok(users);
        }
        [HttpGet("{username}")]
        public async Task< ActionResult<MemberDTO>> GetUser(string username){
           return await _userRepository.GetMemberAsync(username);
        }
    }
}