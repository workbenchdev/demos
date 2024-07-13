public void main () {
    var file = File.new_for_uri (workbench.resolve ("./image.png"));

    var picture = (Gtk.Picture) workbench.builder.get_object ("picture");
    picture.file = file;
}
