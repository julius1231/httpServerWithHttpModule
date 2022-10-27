const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

// // 엔드포인트
// function (request, response) {
//   if (ursl === '/ping'){}
//   if (ursl === '/users/signup'){}
//   if (ursl === '/posts'){}
//   if (ursl === '/posts/1'){}
// }
// =======================================================
const http = require("http"); //http built-in 모듈 호출

const server = http.createServer(); //http 객체 안에 내장되어 있는 createServer()라는 함수르 사용해서 서버 객체를 생성

// 클라이언트 요청이 들어왔을 때 요청을 처리하는 함수 
const httpRequestListener = function(request, response){
  const {url, method} = request;
  if (method === 'GET'){
    if(url === '/ping'){
      response.writeHead(200, {'Content-Type' : 'application/json'});
      response.end(JSON.stringify({message : "pong"}));
    };
  } else if (method === 'POST'){
    if(url === '/user/add'){
      let body = "";
      //body에 담긴 값들이 여러 조각으로 쪼개져서 옵니다. 그렇기 떄문에 여러가지 데이터들을 해당 로직에서 사용하려면 하나로 합쳐야 되는 작업이 필요 (data라는 이벤트가 발생할 때 마다 body라는 변수에 하나하나 합쳐지게 된다.)
      request.on("data", (data)=> {
        body += data;
      });
      //data를 다 받을 경우 end라는 이벤트를 발생시킵니다.
      request.on("end", () => {
        const user = JSON.parse(body); //받아온 Json 데이터를 자바스크립트의 object로 변환을 해준다. 변환된 데이터를 사용하기 위해 user라는 변수에 담는다. 

        //클라이언트로 받은 사용자 정보들을 하나의 객체로 만들어서 push한다.
        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({"message" : "userCreated"}));
      });
    } else if (url === '/post'){
      let body = "";
      request.on('data', (data)=>{
        body += data;
      });
      request.on('end', ()=>{
        const post = JSON.parse(body);
        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId,
        });
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({"message" : "postCreated"}));
      })
    }
  }
} 

server.on("request", httpRequestListener); // Event로서 등록

const IP = '127.0.0.1';
const PORT = 8000;

//server객체가 가지고 있는 listen 함수를 사용해서 해당 ip와 포트 번호에 들어오는 클라이언트의 요청을 계속해서 수신 대기하도록 코드를 작성
// 포트 : a 컴퓨터에서 실행되고 있는 특정 애플리켕이션에 요청을 보내는 것 (애플리케이션은 각각의 포트 번호를 가지고 싱행됩니다)
server.listen(PORT, IP, function(){
  console.log(`Listening to request on ip ${IP} & port ${PORT}`)
})
//listen() 함수가 정상적으로 실행됐는지 확인하기 위헤 콜백 함수에 콘솔 로그를 찍어서 출력
