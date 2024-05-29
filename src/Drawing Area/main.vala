#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1

public void main () {

    var drawing_area = (Gtk.DrawingArea) workbench.builder.get_object ("drawing_area");
    var scale_rotate = (Gtk.Scale) workbench.builder.get_object ("scale");

    double[,] triangle = { { 100.0, 100.0 }, { 0.0, -100.0 }, { -100.0, 100.0 } };

    double angle = 0.0;

    drawing_area.set_draw_func ((area, cr, width, height) => {

        cr.translate (height / 2, width / 2);

        cr.rotate (angle);
        cr.move_to (triangle[2, 0], triangle[2, 1]);
        for (int i = 0; i < 3; i++) { /* Hard coded value given as 3, since length function does not work
                                          for multidimensional array : soln?*/
            cr.line_to (triangle[i, 0], triangle[i, 1]);
        }

        cr.set_source_rgba (1, 0, 1, 1);
        cr.stroke ();
    });

    scale_rotate.value_changed.connect (() => {
        angle = scale_rotate.get_value () * (Math.PI / 180.0);
        drawing_area.queue_draw ();
    });
}
