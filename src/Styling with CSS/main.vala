#! /usr/bin/env -S vala workbench.vala --pkg gtk4

public void main () {
    var basic_label = workbench.builder.get_object("basic_label");
    basic_label.add_css_class("css_text");
}
