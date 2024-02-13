import workbench
import math
import copy

drawing_area = workbench.builder.get_object("drawing_area")
scale_rotate = workbench.builder.get_object("scale")

triangle = [[100, 100], [0, -100], [-100, 100]]
triangle_original = copy.deepcopy(triangle)


def draw(_self, cr, _width, _height):
    # Draw triangle in context
    cr.move_to(150 + triangle[2][0], 150 + triangle[2][1])
    for vertex in triangle:
        cr.line_to(150 + vertex[0], 150 + vertex[1])

    cr.set_source_rgba(1, 0, 1, 1)
    cr.stroke()


def on_rotation_changed(_self):
    # Recalculate triangle vertices
    for i in range(3):
        # Calculate original angle and add scale value in radians
        x, y = triangle_original[i]
        angle = math.atan2(y, x) + math.radians(scale_rotate.get_value())

        # Set new triangle vertex
        radius = math.hypot(x, y)
        triangle[i] = [radius * math.cos(angle), radius * math.sin(angle)]

    # Redraw drawing_area
    drawing_area.queue_draw()


drawing_area.set_draw_func(draw)
scale_rotate.connect("value-changed", on_rotation_changed)

# https://www.cairographics.org/tutorial/
