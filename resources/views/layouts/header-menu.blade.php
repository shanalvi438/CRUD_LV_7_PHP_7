<div class="main-header">
    <div class="menu-toggle">
        <div></div>
        <div></div>
        <div></div>
    </div>
  
    <div style="margin: auto"></div>

    <div class="header-part-right">
        <!-- Grid menu Dropdown -->
        <!-- Users avatar dropdown -->
        <div class="dropdown">
            <div class="user col align-self-end">
                <img src="{{asset('assets/images/user-dummy.png')}}" id="userDropdown" alt=""
                     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                    <div class="dropdown-header">
                        <i class="i-Lock-User mr-1"></i> {{Auth::user()->name}}

                    </div>
                    <a class="dropdown-item" href="{{url('logout')}}"
                       onclick="event.preventDefault();document.getElementById('logout-form').submit();">Sign out</a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                        @csrf
                    </form>
                </div>
            </div>
        </div>
    </div>

</div>
<!-- header top menu end -->
