import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const video = workbench.builder.get_object<Gtk.Video>("video");

video.file = Gio.File.new_for_uri(workbench.resolve("./workbench-video.mp4"));

const click_gesture = new Gtk.GestureClick();

click_gesture.connect("pressed", () => {
  const media_stream = video.media_stream;
  if (media_stream.playing) {
    media_stream.pause();
  } else {
    media_stream.play();
  }
});

video.add_controller(click_gesture);
