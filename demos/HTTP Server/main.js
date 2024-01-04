import Soup from "gi://Soup";

function handler(_server, msg, _path, _query) {
  msg.set_status(200, null);
  msg
    .get_response_headers()
    .set_content_type("text/html", { charset: "UTF-8" });
  msg.get_response_body().append(`
        <html>
        <body>
            Greetings, visitor from ${msg.get_remote_host()}<br>
            What is your name?
            <form action="/hello">
                <input name="myname">
            </form>
        </body>
        </html>
    `);
}

function helloHandler(_server, msg, path, query) {
  if (!query) {
    msg.set_redirect(302, "/");
    return;
  }

  msg.set_status(200, null);
  msg
    .get_response_headers()
    .set_content_type("text/html", { charset: "UTF-8" });
  msg.get_response_body().append(`
        <html>
        <body>
            Hello, ${query.myname}! ☺<br>
            <a href="/">Go back</a>
        </body>
        </html>
    `);
}

let button_server = workbench.builder.get_object("button_server");

let server = new Soup.Server();
server.add_handler("/", handler);
server.add_handler("/hello", helloHandler);

button_server.connect("clicked", () => {
  if (button_server.active) {
    server.listen_local(1080, Soup.ServerListenOptions.IPV4_ONLY);
    button_server.label = "Stop Server";
  } else {
    server.disconnect();
    button_server.label = "Start Server";
  }
});
