@if (session('success'))
    <script>
        var msg = "{{ session('success') }}";
        toastr.success(msg, {
            timeOut: "30000",
        });
    </script>
@endif

@if (session('error'))
    <script>
        var msg = "{{ session('error') }}";
        toastr.error(msg, {
            timeOut: "30000",
        });
    </script>
@endif

@if (session('warning'))
    <script>
        var msg = "{{ session('warning') }}";
        toastr.warning(msg, {
            timeOut: "30000",
        });
    </script>
@endif