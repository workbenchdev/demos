import Gtk from "gi://Gtk?version=4.0";
import cairo from "cairo";

const drawingArea = workbench.builder.get_object<Gtk.DrawingArea>(
  "drawing_area",
);
const scaleRotate = workbench.builder.get_object<Gtk.Scale>("scale");

const triangle = [
  [100, 100],
  [0, -100],
  [-100, 100],
];
var angle = 0;

// TS: the `cairo.Context` type is broken here
// See: https://github.com/gjsify/ts-for-gir/issues/194
drawingArea.set_draw_func((_self, cr: cairo.Context, _width, _height) => {
  // Draw triangle in context
  cr.translate(150, 150);
  cr.rotate(angle);
  cr.moveTo(triangle[2][0], triangle[2][1]);
  for (let vertex of triangle) {
    cr.lineTo(vertex[0], vertex[1]);
  }

  cr.setSourceRGBA(1, 0, 1, 1);
  cr.stroke();
  // Freeing the context before returning from the callback

  // @ts-expect-error this function is not exposed
  // See: https://github.com/gjsify/ts-for-gir/issues/194
  cr.$dispose();
});

scaleRotate.connect("value-changed", () => {
  angle = (scaleRotate.get_value() / 180) * Math.PI;
  drawingArea.queue_draw();
});
//https://www.cairographics.org/tutorial/
