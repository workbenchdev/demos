#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1 --pkg libportal-gtk4 --pkg gstreamer-1.0
public errordomain MessageError {
    FAILED;
}
private Gtk.Picture output;
private Xdp.Portal portal;
private Xdp.Parent parent;

async void start_screencast_session (Xdp.Portal portal, Xdp.Parent parent) throws Error {

    Xdp.Session session = yield portal.create_screencast_session (MONITOR, // Output Type
        NONE, // Screencast Flags
        EMBEDDED, // Cursor Mode
        TRANSIENT, // Persist Mode
        null, // Restore token
        null); // Cancellable

    if (session == null) {
        throw new MessageError.FAILED (@"Permission denied");
    }

    bool success = yield session.start (parent, null);

    if (!success) {
        throw new MessageError.FAILED (@"Could not start session");
    }
    int pw_remote = session.open_pipewire_remote ();
    var pipeline = new Gst.Pipeline ("");
    Gst.Element source = Gst.ElementFactory.make ("pipewiresrc", "source");
    Gst.Element queue = Gst.ElementFactory.make ("queue", "queue"); // add a queue element
    Gst.Element paintable_sink = Gst.ElementFactory.make (
                                                          "gtk4paintablesink",
                                                          "paintable_sink"
    );
    Gst.Element glsinkbin = Gst.ElementFactory.make ("glsinkbin", "glsinkbin");

    // Set up and Link Pipeline
    source.set_property ("fd", pw_remote); // pw_remote is the file descriptor obtained from libportal

    // Obtain the node id from the screencast session
    Variant streams = session.get_streams ();
    uint node_id = streams.get_child_value (0).get_child_value (0).get_uint32 ();
    if (node_id == 0) {
        throw new MessageError.FAILED (@"No available node");
        // stderr.printf ("No available node id\n");
    }

    source.set_property ("path", node_id);
    glsinkbin.set_property ("sink", paintable_sink);

    pipeline.add (source);
    pipeline.add (queue);
    pipeline.add (glsinkbin);
    source.link (queue);
    queue.link (glsinkbin);

    var paintable = Value (typeof (Gdk.Paintable));

    paintable_sink.get_property ("paintable", ref paintable);
    output.paintable = (Gdk.Paintable) paintable.get_object ();

    // Start the pipeline
    pipeline.set_state (PLAYING);

    // Handle cleanup on application exit
    output.destroy.connect (() => {
        pipeline.set_state (NULL);
    });
}

async void on_button_clicked () {
    try {
        yield start_screencast_session (portal, parent);
    } catch (Error e) {
        critical (@"$(e.message)");
    }
}

public void main (string[] args) {
    // Gst.init (ref args);
    portal = new Xdp.Portal ();
    parent = Xdp.parent_new_gtk (workbench.window);
    output = (Gtk.Picture) workbench.builder.get_object ("output");
    var button = (Gtk.Button) workbench.builder.get_object ("button");

    button.clicked.connect (on_button_clicked);
}
