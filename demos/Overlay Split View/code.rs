use crate::workbench;
use adw::prelude::*;
use glib::clone;
use gtk::glib;

pub fn main() {
    let overlay_split_view: adw::OverlaySplitView =
        workbench::builder().object("split_view").unwrap();

    let start_toggle: gtk::ToggleButton = workbench::builder().object("start_toggle").unwrap();
    let end_toggle: gtk::ToggleButton = workbench::builder().object("end_toggle").unwrap();

    start_toggle.connect_toggled(clone!(@weak overlay_split_view => move |_| {
        overlay_split_view.set_sidebar_position(gtk::PackType::Start);
    }));

    end_toggle.connect_toggled(move |_| {
        overlay_split_view.set_sidebar_position(gtk::PackType::End);
    });
}
