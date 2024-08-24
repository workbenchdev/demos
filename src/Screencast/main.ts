import Gdk from "gi://Gdk?version=4.0";
import Gio from "gi://Gio";
import Gst from "gi://Gst";
import GstVideo from "gi://GstVideo?version=1.0";
import Gtk from "gi://Gtk?version=4.0";
import Xdp from "gi://Xdp";
import XdpGtk from "gi://XdpGtk4";

interface GstGtk4PaintableSink extends GstVideo.VideoSink {
  paintable: Gdk.Paintable;
  window_height: number;
  window_width: number;
}

Gst.init(null);

Gio._promisify(
  Xdp.Portal.prototype,
  "create_screencast_session",
  "create_screencast_session_finish",
);

Gio._promisify(Xdp.Session.prototype, "start", "start_finish");

const portal = new Xdp.Portal();
const parent = XdpGtk.parent_new_gtk(workbench.window);
const output = workbench.builder.get_object<Gtk.Picture>("output");
const button = workbench.builder.get_object("button");

button.connect("clicked", () => {
  startScreencastSession().catch(console.error);
});

async function startScreencastSession() {
  // @ts-expect-error this function is not yet detected as async
  const session = await portal.create_screencast_session(
    Xdp.OutputType.MONITOR,
    Xdp.ScreencastFlags.NONE,
    Xdp.CursorMode.EMBEDDED,
    Xdp.PersistMode.TRANSIENT,
    null,
    null,
  ) as Xdp.Session;

  if (!session) {
    console.log("Permission denied");
    return;
  }

  // @ts-expect-error this function is not yet detected as async
  const success = await session.start(parent, null) as boolean;

  if (!success) {
    console.log("Could not start session");
    return;
  }

  const pw_remote = await session.open_pipewire_remote();

  // Create the pipeline
  const pipeline = new Gst.Pipeline();

  // Create elements
  const source = Gst.ElementFactory.make("pipewiresrc", "source");
  const queue = Gst.ElementFactory.make("queue", "queue"); // add a queue element
  const paintable_sink = Gst.ElementFactory.make(
    "gtk4paintablesink",
    "paintable_sink",
  ) as GstGtk4PaintableSink;
  const glsinkbin = Gst.ElementFactory.make("glsinkbin", "glsinkbin");

  // Set up and Link Pipeline
  source.set_property("fd", pw_remote); // pw_remote is the file descriptor obtained from libportal

  // Obtain the node id from the screencast session
  const streams = session.get_streams().deepUnpack();

  // Assuming there's only one stream for simplicity
  const node_id = streams[0][0];
  if (!node_id) {
    console.error("No available node id");
    return;
  }

  // Set the path property of pipewiresrc
  source.set_property("path", node_id);

  glsinkbin.set_property("sink", paintable_sink);

  pipeline.add(source);
  pipeline.add(queue);
  pipeline.add(glsinkbin);
  source.link(queue);
  queue.link(glsinkbin);

  output.paintable = paintable_sink.paintable;

  // Start the pipeline
  pipeline.set_state(Gst.State.PLAYING);

  // Handle cleanup on application exit
  output.connect("destroy", () => {
    pipeline.set_state(Gst.State.NULL);
  });
}
