@extends('layouts.master')
@section('page-css')
<style>
.dropbtn {
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
  z-index: 1;
}

.dropdown-content {
  display: none;
  position: relative;
  background-color: #f6f6f6;
  min-width: 230px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 100;
  max-height: 180px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {background-color: #ddd;}

.show {display: block;}
</style>
@endsection
@section('main-content')
<div data-sidebar-container="chat" class="card chat-sidebar-container" id="chat-main-container">
    @include('apps._chat')
</div>
@endsection

@section('bottom-js')
    <script src="{{asset('public/assets/js/sidebar.script.js')}}"></script>
    <script type="text/javascript">
        // Order status success form
        $(document).on("form-success-event", '#send-message', function (event, responsse) 
        {
                if (responsse.type == "success") {
                    $.ajax({
                       url: '/chat/'+responsse.data.user_id,
                       type: 'GET',
                       data: null,
                       success: function (res) {
                            $("#chat-main-container").html(res.data);
                            // Perfect scrollbar
                            $('.perfect-scrollbar, [data-perfect-scrollbar]').each(function (index) {
                                var $el = $(this);
                                var ps = new PerfectScrollbar(this, {
                                    suppressScrollX: $el.data('suppress-scroll-x'),
                                    suppressScrollY: $el.data('suppress-scroll-y'),
                                    wheelPropagation: true
                                });
                            });
                       }
                    });
                }
        });
        
        function loadChat(eleme) {
            $("#pageloader").fadeIn();
            $.ajax({
               url: '/chat/'+eleme.data('chat_user_id'),
               type: 'GET',
               data: null,
               success: function (res) {
                    $("#chat-main-container").html(res.data);
                    // Perfect scrollbar
                    $('.perfect-scrollbar, [data-perfect-scrollbar]').each(function (index) {
                        var $el = $(this);
                        var ps = new PerfectScrollbar(this, {
                            suppressScrollX: $el.data('suppress-scroll-x'),
                            suppressScrollY: $el.data('suppress-scroll-y'),
                            wheelPropagation: true
                        });
                    });
                    $("#pageloader").fadeOut();
               }
            });
        }
        
        $(document).on("click", 'a.chat_user', function (event) 
        {
            event.preventDefault();
            loadChat($( this ));
        });
        
        $(document).on("click", 'a.chat_users_list_a', function (event) 
        {
            event.preventDefault();
            loadChat($( this ));
        });
        
        
        function filterFunction() {
            
          var input, filter, ul, li, a, i;
          
          input     = document.getElementById("search");
          filter    = input.value.toUpperCase();
          div       = document.getElementById("userDropdownContent");
          a         = div.getElementsByTagName("a");
          
          if(input.value.length >= 3){
            div.style.display = "block";
            for (i = 0; i < a.length; i++) {
                txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  a[i].style.display = "";
                } else {
                  a[i].style.display = "none";
                }
              } 
          }else {
            div.style.display = "none";
          }
        }
    </script>
@endsection
