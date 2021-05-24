using API.Helpers;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    [ServiceFilter(typeof(LoguserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController:ControllerBase
    {
        
    }
}