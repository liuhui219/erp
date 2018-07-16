const url = {

  //  url: 'http://192.168.0.187:80'
  // url: 'http://192.168.93:8080'       // 雪峰
  // url: 'http://192.168.175:8080'       // 周杨
    url: 'http://139.199.76.191:8888'   // 测试服
   //url: 'http://192.168.0.118:8080'
   //url: '/'                            // 正式
};

const setCookies = (cname,cvalue,exdays) => {
  var d = new Date();
  d.setTime(d.getTime()+(exdays*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

const getCookies = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++)
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

export default {url, setCookies, getCookies};
