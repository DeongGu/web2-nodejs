var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === "/"){
      if (queryData.id === undefined) {
        fs.readdir("./data", function(error, fileList){
          var title = "Welcome";
          var description = "Hello, Node.js";
          var list = template.list(fileList);
          const html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      }else {
        fs.readdir("./data", function(error, fileList){
        const filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(fileList);
          const html =template.HTML(sanitizeHtml(title), list, `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}`,
          `<a href="/create">create</a>
           <a href="/update?id=${sanitizeHtml(title)}">update</a>
           <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizeHtml(title)}">
            <input type="submit" value="delete">
            </form>`
            );
          response.writeHead(200);
          response.end(html);
        });
      });
      }
} else if(pathname === '/create'){
  fs.readdir("./data", function(error, fileList){
    var title = "WEB - create";
    var list = template.list(fileList);
    const html = template.HTML(title, list, `
    <form action="/process_create" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
        <textarea name="description" placeholder="description"></textarea>
    </p>
    <p>
        <input type="submit">
    </p>
    </form>
    `,"");
    response.writeHead(200);
    response.end(html);
  });
} else if(pathname === '/process_create'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end('success');  
      })
    });
    
} else if(pathname === '/update'){
  fs.readdir("./data", function(error, fileList){
    const filteredId = path.parse(queryData.id).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = queryData.id;
      var list = template.list(fileList);
      const html =template.HTML(title, list, `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
      response.writeHead(200);
      response.end(html);
    });
  });
} else if(pathname === '/update_process'){
  var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('success');  
        })
      })
    });
} else if(pathname === '/delete_process'){
  var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      const filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        response.writeHead(302, {Location: `/`});
        response.end('success');
      })
    });
} else {
  response.writeHead(404);
  response.end('Not found');
}
});
app.listen(3000);