use crate::workbench;
use glib::clone;
use gtk::glib;
use gtk::prelude::*;
use std::cell::RefCell;
use std::f64::consts::PI;
use std::rc::Rc;

pub fn main() {
    let drawing_area: gtk::DrawingArea = workbench::builder().object("drawing_area").unwrap();
    let scale_rotate: gtk::Scale = workbench::builder().object("scale").unwrap();

    // Create the main triangle data structure using arrays
    let triangle = Rc::new(RefCell::new([
        [100.0, 100.0],
        [0.0, -100.0],
        [-100.0, 100.0],
    ]));

    // Create a copy of the original triangle
    let triangle_original = triangle.borrow().clone();

    drawing_area.set_draw_func(clone!(@weak triangle => move |_area, cr, _width, _height| {
        // Draw triangle in context
        cr.move_to(150. + triangle.borrow()[0][0], 150. + triangle.borrow()[0][1]);
        cr.line_to(150. + triangle.borrow()[1][0], 150. + triangle.borrow()[1][1]);
        cr.line_to(150. + triangle.borrow()[2][0], 150. + triangle.borrow()[2][1]);
        cr.line_to(150. + triangle.borrow()[0][0], 150. + triangle.borrow()[0][1]);

        cr.set_source_rgba(1., 0., 1., 1.);
        cr.stroke().unwrap();
    }));

    scale_rotate.connect_value_changed(move |scale_rotate| {
        // Recalculate value of points of triangle
        for (point, point_original) in triangle.borrow_mut().iter_mut().zip(triangle_original) {
            // Calculate original angle
            let x = point_original[0];
            let y = point_original[1];
            let mut angle = (y.abs() / x.abs()).atan();
            if x > 0. && y > 0. {
                // no change
            }
            if x < 0. && y > 0. {
                angle = PI - angle;
            }
            if x < 0. && y < 0. {
                angle = PI + angle;
            }
            if x > 0. && y < 0. {
                angle = PI * 2. - angle;
            }
            if x == 0. {
                if y > 0. {
                    // no change
                }
                if y < 0. {
                    angle = -1. * angle;
                }
            }
            if y == 0. {
                if x > 0. {
                    // no change
                }
                if x < 0. {
                    // no change
                }
            }
            // Add to original angle scale value
            angle += scale_rotate.value() * PI / 180.;
            // Set new value to triangle
            let radius = (x * x + y * y).sqrt();

            point[0] = radius * angle.cos();
            point[1] = radius * angle.sin();

            // Redraw drawing_area
            drawing_area.queue_draw();
        }
    });
}
