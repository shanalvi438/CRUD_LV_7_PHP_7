<div data-sidebar="chat" class="chat-sidebar-wrap {{(isset($ajax_flag)) ? 'sidebar' : ''}}"  {{(isset($ajax_flag)) ? 'style=left:0px;' : ''}}>
    <div class="border-right">
        <div class="pt-2 pb-2 pl-3 pr-3 d-flex align-items-center o-hidden box-shadow-1 chat-topbar">
            <a data-sidebar-toggle="chat" class="link-icon d-md-none">
                <i class="icon-regular ml-0 mr-3 i-Left"></i>
            </a>
            <div id="userDropdown" class="dropdown">
                <input type="text" class="form-control form-control-rounded dropbtn" id="search" placeholder="Search contacts" onKeyUp="filterFunction()">
            </div>
        </div>
        <div class="contacts-scrollable perfect-scrollbar">
            <div id="userDropdownContent" class="dropdown-content form-group m-0 flex-grow-1">
                @foreach($allUsers as $dUser)
                    <a href="#" class="chat_users_list_a" data-chat_user_id="{{$dUser->id}}" >{{$dUser->name}}</a>
                @endforeach
            </div>
            <!--<div class="mt-4 pb-2 pl-3 pr-3 font-weight-bold text-muted border-bottom">Recent</div>-->
            @foreach($users as $user)
            <a href="#" class="chat_user" data-chat_user_id="{{$user->id}}">
                <div class="p-3 d-flex align-items-center border-bottom">
                    <img src="{{ asset('public/'.$user->image ?? null) }}" class="avatar-sm rounded-circle mr-3" alt="">
                    <div>
                        <h5 class="m-0">{{$user->name}}</h5>
                        <!--<span class="text-muted text-small">3 Oct, 2018</span>-->
                    </div>
                </div>
            </a>
            @endforeach
        </div>
    </div>
</div>
<div data-sidebar-content="chat" class="chat-content-wrap {{(isset($ajax_flag)) ? 'sidebar-content' : ''}}" {{(isset($ajax_flag)) ? 'style=margin-left:260px;' : ''}}>
    <div class="d-flex pl-3 pr-3 pt-2 pb-2 o-hidden box-shadow-1 chat-topbar">
        <a data-sidebar-toggle="chat" class="link-icon d-md-none">
            <i class="icon-regular i-Right ml-0 mr-3"></i>
        </a>
        <div class="d-flex align-items-center">
            <img src="{{ asset('public/'.$chat_user->image ?? null) }}" alt="" class="avatar-sm rounded-circle mr-2">
            <p class="m-0 text-title text-16 flex-grow-1" data-user_id="{{$chat_user->id}}">{{$chat_user->name}}</p>
        </div>
    </div>
    <div class="chat-content perfect-scrollbar" data-suppress-scroll-x="true">
        @foreach($chats as $chat)
        <div class="d-flex mb-4" style="flex-direction: column; width: 100%; {{(($chat['sender_id'] == $adminId))? 'align-items: flex-end;': 'align-items: flex-start;'}}">
            <div class="message flex-grow-1">
                <div class="d-flex">
                    <p class="mb-1 text-title text-16 flex-grow-1">{{(($chat['sender_id'] == $adminId))? auth()->user()->name: $chat_user->name }}</p>
                    <span class="text-small text-muted pl-4">{{ \Carbon\Carbon::createFromTimestamp($chat['timestamp'])->diffForHumans()}}</span>
                </div>
                @if(isset($chat['media_type']) && $chat['media_type'] == 2)
                    <div class="d-flex mb-2">
                        @foreach($chat['files'] as $file)
                            <video width="320" height="240" controls>
                              <source src="{{asset('/public/storage/'.$file)}}" type="video/mp4">
                            </video>
                        @endforeach
                    </div>
                @endif
                @if(isset($chat['media_type']) && $chat['media_type'] == 1)
                    <div class="d-flex mb-2">
                        @foreach($chat['files'] as $file)
                            <img src="{{asset('/public/storage/'.$file)}}" style="max-height:300px; max-width:300px;" class="img-thumbnail rounded mr-2">
                        @endforeach
                    </div>
                @endif
                <p class="m-0">{{$chat['message'] ?? " "}}</p>
            </div>
        </div>
        @endforeach
    </div>
    <div class="pl-3 pr-3 pt-3 pb-3 box-shadow-1 chat-input-area">
        {!! Form::open(['url' => route('chat-add-message', $chat_user->id), 'class'=> 'inputForm ajax', 'method' => 'post', 'id' => 'send-message']) !!}
            {{ csrf_field() }}
            <div class="form-group">
                        <textarea class="form-control form-control-rounded" placeholder="Type your message"
                                  name="message" id="message" cols="30" rows="3" required></textarea>
            </div>
            <div class="d-flex">
                <div class="flex-grow-1"></div>
                <button class="btn btn-icon btn-rounded btn-primary mr-2" form="send-message" value="Submit">
                    <i class="i-Paper-Plane"></i>
                </button>
            </div>
        {!! Form::close() !!}
    </div>
</div>