import Gdk from "gi://Gdk?version=4.0";
import Gio from "gi://Gio";
import Gsk from "gi://Gsk?version=4.0";
import Gst from "gi://Gst";
import GstVideo from "gi://GstVideo";
import Gtk from "gi://Gtk?version=4.0";
import Xdp from "gi://Xdp";
import XdpGtk from "gi://XdpGtk4";

interface GstGtk4Paintable extends Gdk.Paintable {
  background_color: number;
  force_aspect_ratio: number;
  gl_context?: Gdk.GLContext;
  orientation: number;
  scaling_filter: Gsk.ScalingFilter;
  use_scaling_filter: number;
}

interface GstGtk4PaintableSink extends GstVideo.VideoSink {
  paintable: GstGtk4Paintable;
  window_height: number;
  window_width: number;
}

Gst.init(null);
Gio._promisify(Xdp.Portal.prototype, "access_camera", "access_camera_finish");

const portal = new Xdp.Portal();
const parent = XdpGtk.parent_new_gtk(workbench.window);

const output = workbench.builder.get_object<Gtk.Picture>("output");
const button = workbench.builder.get_object<Gtk.Button>("button");

button.connect("clicked", () => {
  accessCamera().catch(console.error);
});

async function accessCamera() {
  if (!portal.is_camera_present()) {
    console.log("No Camera detected");
    return;
  }

  // @ts-expect-error an undetected async function
  const success = await portal.access_camera(
    parent,
    Xdp.CameraFlags.NONE,
    null,
  ) as boolean;

  if (!success) {
    console.log("Permission denied");
    return;
  }

  await handleCamera();
}

async function handleCamera() {
  const fd_pipewire_remote = portal.open_pipewire_remote_for_camera();
  console.log("Pipewire remote opened for camera");

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
  source.set_property("fd", fd_pipewire_remote); // fd_pipewire_remote is the file descriptor obtained from libportal
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

  // Set up the bus
  const bus = pipeline.get_bus();
  bus.add_signal_watch();
  bus.connect("message", (_self, message) => {
    // Check the message type
    const message_type = message.type;

    // Handle different message types
    switch (message_type) {
      case Gst.MessageType.ERROR: {
        const errorMessage = message.parse_error();
        console.error(errorMessage[0].toString());
        break;
      }
      case Gst.MessageType.EOS: {
        console.log("End of stream");
        break;
      }
    }
  });
}
