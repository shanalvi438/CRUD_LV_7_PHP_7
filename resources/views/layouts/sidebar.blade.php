<div class="side-content-wrap">
    <div class="sidebar-left open rtl-ps-none" data-perfect-scrollbar data-suppress-scroll-x="true">
        <ul class="navigation-left">
            <li class="nav-item {{ request()->is('home') ? 'active' : '' }}">
                <a class="nav-item-hold" href="{{url('/home')}}">
                    <i class="nav-icon i-Bar-Chart"></i>
                    <span class="nav-text">Dashboard</span>
                </a>
                <div class="triangle"></div>
            </li>
            <li class="nav-item {{ request()->is('admin*') ? 'active' : '' }}">
                <a class="nav-item-hold" href="{{route('admin')}}">
                    <i class="nav-icon i-Administrator"></i>
                    <span class="nav-text">Admin</span>
                </a>
                <div class="triangle"></div>
            </li>
            
            <li class="nav-item {{ request()->is('companies.index*') ? 'active' : '' }}">
                <a class="nav-item-hold" href="{{route('companies.index')}}">
                    <i class="nav-icon i-Notepad"></i>
                    <span class="nav-text">Comapnies</span>
                </a>
                <div class="triangle"></div>
            </li>
            <li class="nav-item {{ request()->is('employees.index*') ? 'active' : '' }}">
                <a class="nav-item-hold" href="{{route('employees.index')}}">
                    <i class="nav-icon i-Notepad"></i>
                    <span class="nav-text">Employee</span>
                </a>
                <div class="triangle"></div>
            </li>
           
        </ul>
    </div>
</div>