import Swal from 'sweetalert2';

export default Swal.mixin({
  background: '#1b1838',
  color: '#ede8ff',
  confirmButtonColor: '#8b5cf6',
  cancelButtonColor: '#242048',
  customClass: {
    popup: 'swal2-vapor-popup',
    confirmButton: 'swal2-vapor-confirm',
    cancelButton: 'swal2-vapor-cancel',
  },
});
