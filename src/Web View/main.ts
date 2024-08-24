import GLib from "gi://GLib";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=4.0";
import WebKit from "gi://WebKit";

const button_back = workbench.builder.get_object("button_back");
const button_forward = workbench.builder.get_object("button_forward");
const button_reload = workbench.builder.get_object("button_reload");
const button_stop = workbench.builder.get_object("button_stop");
const url_bar = workbench.builder.get_object<Gtk.Entry>("url_bar");
const web_view = workbench.builder.get_object<WebKit.WebView>("web_view");

// URL bar displays the current loaded page
web_view.bind_property(
  "uri",
  url_bar.buffer,
  "text",
  GObject.BindingFlags.DEFAULT,
);

web_view.load_uri("https://www.gnome.org/");

url_bar.connect("activate", () => {
  let url = url_bar.buffer.text;
  const scheme = GLib.Uri.peek_scheme(url);
  if (!scheme) {
    url = `http://${url}`;
  }
  web_view.load_uri(url);
});

button_forward.connect("clicked", () => {
  web_view.go_forward();
});

button_back.connect("clicked", () => {
  web_view.go_back();
});

button_reload.connect("clicked", () => {
  web_view.reload();
});

button_stop.connect("clicked", () => {
  web_view.stop_loading();
});

web_view.connect("load-changed", (_self, load_event) => {
  switch (load_event) {
    case WebKit.LoadEvent.STARTED:
      console.log("Page loading started");
      break;
    case WebKit.LoadEvent.FINISHED:
      console.log("Page loading has finished ");
      break;
  }
});

web_view.connect("load-failed", (_self, _load_event, fail_url, error) => {
  // Loading failed as a result of calling stop_loading
  if (error.matches(WebKit.NetworkError, WebKit.NetworkError.CANCELLED)) {
    return;
  }

  web_view.load_alternate_html(
    error_page(fail_url, error.message),
    fail_url,
    null,
  );
});

web_view.connect("notify::estimated-load-progress", () => {
  url_bar.progress_fraction = web_view.estimated_load_progress;
  if (url_bar.progress_fraction === 1) {
    setTimeout(() => {
      url_bar.progress_fraction = 0;
    }, 500);
  }
});

function error_page(fail_url, msg) {
  const error = `
    <div style="text-align:center; margin:24px;">
    <h2>An error occurred while loading ${fail_url}</h2>
    <p>${msg}</p>
    </div>
  `;
  return error;
}
