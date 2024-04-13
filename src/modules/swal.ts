import Swal, { SweetAlertIcon } from "sweetalert2";

const DEFAULTS = {
  heightAuto: false,
  scrollbarPadding: false
};

export function swalConfirm(desc: string, title: string = "Confirm?", confirmText: string = "Yes") {
  return Swal.fire({
    title: title,
    text: desc,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    ...DEFAULTS,
  });
}

export function swalBasic(title: string, desc: string, icon: SweetAlertIcon) {
  return Swal.fire({
    title: title,
    text: desc,
    icon: icon,
    ...DEFAULTS,
  });
}
