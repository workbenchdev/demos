#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1 --pkg gtksourceview-5

public void main () {
    /*
     * Strictly speaking we don't _have_ to do this here since WorkBench does this for us.
     * However, you _have_ to call this once during the startup in your application - e.g. in Application::startup
     */
    GtkSource.init ();

    // Get the language we want to use
    var language_manager = GtkSource.LanguageManager.get_default ();
    var language = language_manager.get_language ("js");
    // Create the buffer - this holds the text that's used in the SourceView
    var buffer = new GtkSource.Buffer.with_language (language) {
        text = "console.log(\"Hello World!\");"
    };

    // Create the SourceView which displays the buffer's display
    var source_view = new GtkSource.View.with_buffer (buffer) {
        auto_indent = true,
        indent_width = 4,
        show_line_numbers = true
    };

    // Add the SourceView to our ScrolledView so its displayed
    var scrolled_window = (Gtk.ScrolledWindow) workbench.builder.get_object ("scrolled_window");
    scrolled_window.child = source_view;
}
