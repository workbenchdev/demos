#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1 --pkg libportal-gtk4 --pkg gstreamer-1.0

private Gtk.Picture output;

async void start_screencast_session (Xdp.Portal portal, Xdp.Parent parent) {
    try {
        Xdp.Session session = yield portal.create_screencast_session (Xdp.OutputType.MONITOR,
            Xdp.ScreencastFlags.NONE,
            Xdp.CursorMode.EMBEDDED,
            Xdp.PersistMode.TRANSIENT,
            null,
            null);

        if (session == null) {
            message ("Permission denied");
            return;
        }

        var success = yield session.start (parent, null);

        if (!success) {
            message ("Could not start session");
            return;
        }
        var pw_remote = session.open_pipewire_remote ();
        var pipeline = new Gst.Pipeline ("");
        var source = Gst.ElementFactory.make ("pipewiresrc", "source");
        var queue = Gst.ElementFactory.make ("queue", "queue"); // add a queue element
        var paintable_sink = Gst.ElementFactory.make (
                                                      "gtk4paintablesink",
                                                      "paintable_sink"
        );
        var glsinkbin = Gst.ElementFactory.make ("glsinkbin", "glsinkbin");

        // Set up and Link Pipeline
        source.set_property ("fd", pw_remote); // pw_remote is the file descriptor obtained from libportal

        // Obtain the node id from the screencast session
        var streamss = session.get_streams ();
        var node_id = streamss.get_child_value (0);

        if (node_id == null) {
            stderr.printf ("No available node id\n");
            return;
        }

        source.set_property ("path", node_id);
        glsinkbin.set_property ("sink", paintable_sink);

        pipeline.add (source);
        pipeline.add (queue);
        pipeline.add (glsinkbin);
        source.link (queue);
        queue.link (glsinkbin);

        var paintable = GLib.Value (typeof (Gdk.Paintable));

        paintable_sink.get_property ("paintable", ref paintable);
        output.paintable = (Gdk.Paintable) paintable.get_object ();

        // Start the pipeline
        pipeline.set_state (Gst.State.PLAYING);

        // Handle cleanup on application exit
        output.destroy.connect (() => {
            pipeline.set_state (Gst.State.NULL);
        });
    } catch (Error e) {
        message (@"$(e.message)");
    }
}

public void main (string[] args) {
    // Gst.init (ref args);
    var portal = new Xdp.Portal ();
    var parent = Xdp.parent_new_gtk (workbench.window);
    output = (Gtk.Picture) workbench.builder.get_object ("output");
    var button = (Gtk.Button) workbench.builder.get_object ("button");

    button.clicked.connect (() => { start_screencast_session.begin (portal, parent); });
}
