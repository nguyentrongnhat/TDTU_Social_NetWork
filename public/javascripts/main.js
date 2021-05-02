$(document).ready(function () {
    console.log('ready!');
    // HIỆN ẨN MODAL ĐĂNG BÀI
    $('.answer-post').click(function () {
        $('#post-modal-id').css('display', 'flex');
        console.log($('#post-modal-id').css('display'));
    });

    $('#add_item_nav').click(function () {
        let display = $('#post-modal-id').css('display');
        if (display === 'none') {
            $('#post-modal-id').css('display', 'flex');
        } else {
            $('#post-modal-id').css('display', 'none');
        }
    });

    $('.modal_overlay').click(() => {
        $('#post-modal-id').css('display', 'none');
        $('.text_content_post_modal').val('');
        $('#src_video_youtube').val('');
        $('input[type=file]').val('');
        console.log($('#post-modal-id').css('display'));
    })

    $('.close_modal').click(() => {
        $('#post-modal-id').css('display', 'none');
        $('.text_content_post_modal').val('');
        $('#src_video_youtube').val('');
        $('input[type=file]').val('');
        console.log($('#post-modal-id').css('display'));
    })
    
    // THÔNG BÁO SIDE BAR TRÁI
    $('#notify-classificate').click(() => {
        var display = $('.side-bar-notify-second-item').css('display');
        if (display == 'none') {
            $('.side-bar-notify-second-item').css('display', 'flex');
        }
        else {
            $('.side-bar-notify-second-item').css('display', 'none');
        }
    })

    $('.link_youtube_modal').click(() => {
        var display = $('#get_link_youtube').css('display');
        if (display === 'none') {
            $('#get_link_youtube').css('display', 'flex');
        } else {
            $('#get_link_youtube').css('display', 'none');
        }

    })

    $('.upload_image_modal').click(() => {
        var display = $('#get_img').css('display');
        if (display === 'none') {
            $('#get_img').css('display', 'flex');
        } else {
            $('#get_img').css('display', 'none');
        }

    })

    // CREATE POST
    $('.btn-post').click((e) => {
        //let author = $('#modal_display_name').html();
        //let avatar_image_src = $('#modal_user_avatar_img').attr('src');
        let id_author = e.target.dataset.author_id;
        let textContent = $('.text_content_post_modal').val();
        let image_src = $('input[type=file]')[0].files[0];//$('#src_img').files[0];
        let video_id = $('#src_video_youtube').val();
        console.log(image_src)
        let post = new FormData();
        post.append('id_author', id_author);
        post.append('textContent', textContent);
        post.append('image_src', image_src);
        post.append('video_id', video_id);

        let mode = e.target.dataset.mode;
        let post_id = e.target.dataset.post_id;

        if(mode === 'update') {
            $('.btn-post').attr('data-mode','create');
            post.append('_id', post_id);
            editPostAjax(post);
        }
        else if(mode === 'create') {
            addPostAjax(post);
        }
        $('#post-modal-id').css('display', 'none');
        $('.text_content_post_modal').val('');
        $('#src_video_youtube').val('');
        $('input[type=file]').val('');
    });

    function editPostAjax(post) {
        console.log('vao edit')
        $.ajax({
            url: '/post/edit',
            data: post,
            type: 'POST',
            contentType: false, 
            processData: false
        }).done(function(res) {
            let post = res.post;
                let user = res.user;
                var new_post =
                `<div class="card shadow-sm" id="${post._id}">
				<div class="card-body">
					<div class="header-content">
						<img src="${user.avatar_img}" class="avatar-image" height="40px" width="40px">
						<div class="info-post">
							<div class="user-name text">${user.display_name}</div>
						</div>
						
						<div id="option_post">
							<div class="icon_otion_delete_update" data-update_delete_option="${post._id}">
								<i class="fas fa-ellipsis-v"  data-update_delete_option="${post._id}"></i>
							</div>
							
							<div class="update_delete_option" id="update_delete_option${post._id}">
								<ul class="list_update_delete_option">
									<li class="item_update_delete_option delete_post_option" data-post_id="${post._id}">
										<i class="far fa-trash-alt" data-post_id="${post._id}"></i>
										<p class="text_item_update_delete_option delete" data-post_id="${post._id}">Xóa</p>
									</li>
									<li class="item_update_delete_option edit_post_option" data-post_id="${post._id}">
										<i class="far fa-edit" data-post_id="${post._id}"></i>
										<p class="text_item_update_delete_option edit" data-post_id="${post._id}">Sửa</p>
									</li>
								</ul>
							</div>
						</div>
			
					</div>
					<div class="text-post">
						<p class="card-text text">${post.textContent}</p>
					</div>
				</div>`
				if (post.image_src.length > 0) { 
                    new_post += 
					`<a href="/post/<%=post._id%>">
						<img src="${post.image_src}" class="card-img-top" alt="...">
					</a>`
                }
				if (post.video_id.length > 0) {
                    new_post +=
					`<iframe width="100%" height="315" src="https://www.youtube.com/embed/${post.video_id}" title="Iframe Youtube"></iframe>`
				}
                new_post +=
				`<div class="card-body card-body-react-block">
					<div class="react-infor">
						<div class="react-infor__like">
							<i class="fas fa-thumbs-up"></i>&#8194<span class="text" id="like_num${post._id}">${post.like}</span>
						</div>
						<div class="react-infor__comment">
							<span class="text" id="cmt_num${post._id}">${post.comment}</span>&#8194<span>bình luận</span>
						</div>
					</div>
					<div class="separate-line"></div>
					<div class="btn-react">
						<div class="btn-react__like" data-user_id="${user._id.toString()}" data-post_id="${post._id}"> 
							<i class="far fa-thumbs-up" data-user_id="${user._id}" data-post_id="${post._id}" id="like_btn${post._id}"></i>   
							<span class="text" data-user_id="${user._id}" data-post_id="${post._id}">Thích</span>		
						</div>
						<div class="btn-react__comment" data-post_id="${post._id}">
							<i class="far fa-comments" data-post_id="${post._id}"></i> <span class="text" data-post_id="${post._id}">Bình luận</span>
						</div>
					</div>
					<div class="comment_place_block" id="comment_place_block${post._id}">
						<div class="separate-line"></div>
						<div class="comment_block">
							<div class="write_comment_blok">
								<img src="${user.avatar_img}" alt="avatar user" class="avatar_comment">
								<input type="email" class="form-control comment_input" placeholder="Viết bình luận của bạn" data-id_author="${user._id}" id="inputComment${post._id}" data-id_post="${post._id}" data-author_name="${user.display_name}" data-author_avatar="${user.avatar_img}">
							</div>

							<div class="list_comment_block">
								<ul class="comment_list" id="block_comment_display${post._id}">
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>`;
            $('#' + post._id.toString()).replaceWith(new_post);
            console.log('da thay the')
        });
    }

    function addPostAjax(post) {
        $.ajax({
            url: '/post/create',
            data: post,
            type: 'POST',
            contentType: false, 
            processData: false
        }).done(function(res) {
            let post = res.post;
                let user = res.user;
                var new_post =
                `<div class="card shadow-sm" id="${post._id}">
				<div class="card-body">
					<div class="header-content">
						<img src="${user.avatar_img}" class="avatar-image" height="40px" width="40px">
						<div class="info-post">
							<div class="user-name text">${user.display_name}</div>
						</div>
						
						<div id="option_post">
							<div class="icon_otion_delete_update" data-update_delete_option="${post._id}">
								<i class="fas fa-ellipsis-v"  data-update_delete_option="${post._id}"></i>
							</div>
							
							<div class="update_delete_option" id="update_delete_option${post._id}">
								<ul class="list_update_delete_option">
									<li class="item_update_delete_option delete_post_option" data-post_id="${post._id}">
										<i class="far fa-trash-alt" data-post_id="${post._id}"></i>
										<p class="text_item_update_delete_option delete" data-post_id="${post._id}">Xóa</p>
									</li>
									<li class="item_update_delete_option edit_post_option" data-post_id="${post._id}">
										<i class="far fa-edit" data-post_id="${post._id}"></i>
										<p class="text_item_update_delete_option edit" data-post_id="${post._id}">Sửa</p>
									</li>
								</ul>
							</div>
						</div>
			
					</div>
					<div class="text-post">
						<p class="card-text text">${post.textContent}</p>
					</div>
				</div>`
				if (post.image_src.length > 0) { 
                    new_post += 
					`<a href="/post/<%=post._id%>">
						<img src="${post.image_src}" class="card-img-top" alt="...">
					</a>`
                }
				if (post.video_id.length > 0) {
                    new_post +=
					`<iframe width="100%" height="315" src="https://www.youtube.com/embed/${post.video_id}" title="Iframe Youtube"></iframe>`
				}
                new_post +=
				`<div class="card-body card-body-react-block">
					<div class="react-infor">
						<div class="react-infor__like">
							<i class="fas fa-thumbs-up"></i>&#8194<span class="text" id="like_num${post._id}">${post.like}</span>
						</div>
						<div class="react-infor__comment">
							<span class="text" id="cmt_num${post._id}">${post.comment}</span>&#8194<span>bình luận</span>
						</div>
					</div>
					<div class="separate-line"></div>
					<div class="btn-react">
						<div class="btn-react__like" data-user_id="${user._id.toString()}" data-post_id="${post._id}"> 
							<i class="far fa-thumbs-up" data-user_id="${user._id}" data-post_id="${post._id}" id="like_btn${post._id}"></i>   
							<span class="text" data-user_id="${user._id}" data-post_id="${post._id}">Thích</span>		
						</div>
						<div class="btn-react__comment" data-post_id="${post._id}">
							<i class="far fa-comments" data-post_id="${post._id}"></i> <span class="text" data-post_id="${post._id}">Bình luận</span>
						</div>
					</div>
					<div class="comment_place_block" id="comment_place_block${post._id}">
						<div class="separate-line"></div>
						<div class="comment_block">
							<div class="write_comment_blok">
								<img src="${user.avatar_img}" alt="avatar user" class="avatar_comment">
								<input type="email" class="form-control comment_input" placeholder="Viết bình luận của bạn" data-id_author="${user._id}" id="inputComment${post._id}" data-id_post="${post._id}" data-author_name="${user.display_name}" data-author_avatar="${user.avatar_img}">
							</div>

							<div class="list_comment_block">
								<ul class="comment_list" id="block_comment_display${post._id}">
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>`;
            $(".card-thinking").after(new_post);
        });
    }

    function addPost(data) {
        fetch("/post/create",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                processData: false,
                contentType: false,
            })
            .then(function (res) { return res.json(); })
            .then(res => {
                console.log(res)
                let post = res.post;
                let user = res.user;
                var new_post =
                `<div class="card shadow-sm" id="${post._id}">
				<div class="card-body">
					<div class="header-content">
						<img src="${user.avatar_img}" class="avatar-image" height="40px" width="40px">
						<div class="info-post">
							<div class="user-name text">${user.display_name}</div>
						</div>
						
						<div id="option_post">
							<div class="icon_otion_delete_update" data-update_delete_option="${post._id}">
								<i class="fas fa-ellipsis-v"  data-update_delete_option="${post._id}"></i>
							</div>
							
							<div class="update_delete_option" id="update_delete_option${post._id}">
								<ul class="list_update_delete_option">
									<li class="item_update_delete_option delete_post_option" data-post_id="${post._id}">
										<i class="far fa-trash-alt" data-post_id="${post._id}"></i>
										<p class="text_item_update_delete_option delete" data-post_id="${post._id}">Xóa</p>
									</li>
									<li class="item_update_delete_option edit_post_option" data-post_id="${post._id}">
										<i class="far fa-edit" data-post_id="${post._id}"></i>
										<p class="text_item_update_delete_option edit" data-post_id="${post._id}">Sửa</p>
									</li>
								</ul>
							</div>
						</div>
			
					</div>
					<div class="text-post">
						<p class="card-text text">${post.textContent}</p>
					</div>
				</div>`
				if (post.image_src.length > 0) { 
                    new_post += 
					`<a href="/post/<%=post._id%>">
						<img src="<%=post.image_src%>" class="card-img-top" alt="...">
					</a>`
                }
				if (post.video_id.length > 0) {
                    new_post +=
					`<iframe width="100%" height="315" src="https://www.youtube.com/embed/${post.video_id}" title="Iframe Youtube"></iframe>`
				}
                new_post +=
				`<div class="card-body card-body-react-block">
					<div class="react-infor">
						<div class="react-infor__like">
							<i class="fas fa-thumbs-up"></i>&#8194<span class="text" id="like_num${post._id}">${post.like}</span>
						</div>
						<div class="react-infor__comment">
							<span class="text">${post.comment}</span>&#8194<span>bình luận</span>
						</div>
					</div>
					<div class="separate-line"></div>
					<div class="btn-react">
						<div class="btn-react__like" data-user_id="${user._id.toString()}" data-post_id="${post._id}"> 
							<i class="far fa-thumbs-up" data-user_id="${user._id}" data-post_id="${post._id}" id="like_btn${post._id}"></i>   
							<span class="text" data-user_id="${user._id}" data-post_id="${post._id}">Thích</span>		
						</div>
						<div class="btn-react__comment" data-post_id="${post._id}">
							<i class="far fa-comments" data-post_id="${post._id}"></i> <span class="text" data-post_id="${post._id}">Bình luận</span>
						</div>
					</div>
					<div class="comment_place_block" id="comment_place_block${post._id}">
						<div class="separate-line"></div>
						<div class="comment_block">
							<div class="write_comment_blok">
								<img src="${user.avatar_img}" alt="avatar user" class="avatar_comment">
								<input type="email" class="form-control comment_input" placeholder="Viết bình luận của bạn" data-id_author="${user._id}" id="inputComment${post._id}" data-id_post="${post._id}" data-author_name="${user.display_name}" data-author_avatar="${user.avatar_img}">
							</div>

							<div class="list_comment_block">
								<ul class="comment_list" id="block_comment_display${post._id}">
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>`;
                $(".card-thinking").after(new_post);
            })
            .catch(function (res) { console.log(res) })
    }

     //EDIT POST
    $(document).on('click', '.edit_post_option', e => {
        //e.stopPropagation();
        let post_id = e.target.dataset.post_id;
        getPost({post_id});
    });

    function getPost(data) {
        fetch('/post/getOne',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function (res) { return res.json() })
            .then(res => {
                if(res.code === 200) {
                    let post = res.post;
                    console.log(post);
                    $('.btn-post').attr('data-mode','update');
                    $('.btn-post').attr('data-post_id', post._id.toString());
                    $('.text_content_post_modal').val(post.textContent);
                    if(post.video_id !== '') {
                        $('#src_video_youtube').val('https://www.youtube.com/watch?v=' + post.video_id);
                    }
                    $('#post-modal-id').css('display', 'flex');
                }
                else{
                    console.log('error');
                }
            })
            .catch(function (res) { console.log(res) })
    }

    //REMOVE POST
    $(document).on('click', '.delete_post_option', e => {
        //e.stopPropagation();
        let post_id = e.target.dataset.post_id;
        console.log({post_id});
        deletePost({post_id});
    });

    function deletePost(data) {
        fetch('/post/delete',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            })
            .then(function (res) { return res.json() })
            .then(res => {
                if(res.code === 200) {
                    console.log(res);
                    post_id = '#' + res.post_id;
                    $(post_id).remove();   
                }
                else{
                    console.log('error');
                }
            })
            .catch(function (res) { console.log(res) })
    }

    //NAVBAR OPTION LIST - LOGIN - USER PAGE
    $('#logout-droplist_item').click((e) => {
        e.stopPropagation();
        let display = $('.nav-item-loguot-option').css('display');
        if (display === 'none') {
            $('logout-droplist_item').css('color', '#056BE1');
            $('.nav-item-loguot-option').css('display', 'flex');
        }
        else {
            $('.nav-item-loguot-option').css('display', 'none');
            $('logout-droplist_item').css('color', '#333');
        }
    })

    $(document).click(function () {
        $('.nav-item-loguot-option').css('display', 'none');
        $('.update_delete_option').css('display', 'none');
        $('.option_comment').css('display', 'none');
    });

    $(".nav-item-loguot-option").click(function (e) {
        e.stopPropagation();
    });

    // EDIT - UPDATE - OPTION
        //post
    $(document).on ('click', '.icon_otion_delete_update', e => {
        e.stopPropagation();
        let id = '#update_delete_option' + e.target.dataset.update_delete_option;
        var display = $(id).css('display');
        if(display === 'none') {
            $(id).css('display', 'flex');
        }
        else {
            $(id).css('display', 'none');
        }
    });
        //comment
    $(document).on('click', '.option_comment', e => {
       // console.log('da click');
    });

    $('body').on('click', '.icon_otion_delete_update_comment', (e) => {
        e.stopPropagation();
        let id_comment = '#option_comment' + e.target.dataset.update_delete_option_comment;
        console.log(id_comment);
        var display = $(id_comment).css('display');
        if(display === 'none') {
            $(id_comment).css('display', 'flex');
        }
        else {
            $(id_comment).css('display', 'none');
        }
    });

    //Like

    $(document).on('click', '.btn-react__like', (e) => {
        var id = '#like_btn' + e.target.dataset.post_id;
        var x = $(id).attr('class');

        id_like_num = '#like_num' + e.target.dataset.post_id;
        var like_num = $(id_like_num).text();

        let post_id = e.target.dataset.post_id;
        let user_id = e.target.dataset.user_id

        let data_react = { post_id, user_id }

        if (x === 'fas fa-thumbs-up') {
            $(id).attr('class', 'far fa-thumbs-up');
            $(id_like_num).text(parseInt(like_num) - 1);
            deleteReact(data_react);
        }
        else {
            console.log('da vao')
            console.log($(id).attr('class'))
            $(id).attr('class', 'fas fa-thumbs-up');
            console.log($(id).attr('class'))
            $(id_like_num).text(parseInt(like_num) + 1);
            createReact(data_react);
        }
    });

    function createReact(data) {
        fetch("/react/create",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            })
            .then(function (res) { return res.json(); })
            .then(res => {
                console.log(res)
            })
            .catch(function (res) { console.log(res) })
    }

    function deleteReact(data) {
        fetch("/react/delete",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            })
            .then(function (res) { return res.json(); })
            .then(res => {
                console.log(res)
            })
            .catch(function (res) { console.log(res) })
    }

    // COMMENT

    $(document).on('keypress', '.comment_input', e => {
        var key = e.which;
        let id_input = '#inputComment' + e.target.dataset.id_post;
        console.log(id_input);
        if (key == 13 && $(id_input).val() != '')  // the enter key code
        {
            let id_cmt_num= '#cmt_num' + e.target.dataset.id_post;
            $(id_cmt_num).text(parseInt($(id_cmt_num).text()) + 1);
            let id_author = e.target.dataset.id_author;
            let id_post =  e.target.dataset.id_post;
            let comment_content = $(id_input).val();
            let author_name = e.target.dataset.author_name;
            let author_avatar =  e.target.dataset.author_avatar;
            let data = {id_author, id_post, comment_content}
            console.log(data);
            $('.comment_input').val('');
            createComment (data, author_name, author_avatar);
        }    
    });

    function createComment(data, name, avatar) {
        fetch("/comment/create",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            })
            .then(function (res) { return res.json(); })
            .then(res => {
                console.log(res)
                if(res.code === 200) {
                    post_id = '#block_comment_display' + data.id_post;
                    comment_html =
                    `<li class="comment_list_item" id="${res.new_comment._id.toString()}">
                        <div class="comment_item">
                            <img src="${avatar}" alt="avatar user" class="avatar_comment">
                            <div class="content_comment">
                                <div class="author_comment">
                                    <strong>${name}</strong>
                                </div>
                                <div class="comment">${data.comment_content}</div>
                            </div>

                            <div class="icon_otion_delete_update icon_otion_delete_update_comment" data-update_delete_option_comment="${res.new_comment._id.toString()}">
                                <i class="fas fa-ellipsis-v"  data-update_delete_option_comment="${res.new_comment._id.toString()}"></i>
                            </div>

                            <div class="option_comment" id="option_comment${res.new_comment._id.toString()}">
                                <ul class="list_update_delete_option">
                                    <li class="item_update_delete_option_comment" data-comment_id="${res.new_comment._id.toString()}" data-post_id_to_remove_comment="${data.id_post}">
                                        <i class="far fa-trash-alt" data-comment_id="${res.new_comment._id.toString()} data-post_id_to_remove_comment="${data.id_post}""></i>
                                        <p class="text_item_update_delete_option delete" data-comment_id="${res.new_comment._id.toString()}" data-post_id_to_remove_comment="${data.id_post}">Xóa</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>`
                    console.log(post_id);
                    $(post_id).prepend(comment_html);
                }
                else{
                    console.log('error');
                }
            })
            .catch(function (res) { console.log(res) })
    }

    /* ẨN HIỆN COMMENT - GET COMMENT */

    $(document).on('click', '.btn-react__comment', e => {
        let post_id = e.target.dataset.post_id;
        console.log(post_id)
        let id_block_comment = '#comment_place_block' + post_id;
        var display = $(id_block_comment).css('display');
        if(display === 'none') {
            $(id_block_comment).css('display', 'flex');
            let data = {post_id};
            loadComment(data);
        }
        else {
            $(id_block_comment).css('display', 'none');
            $('#block_comment_display' + post_id).empty();
        }
    })

    /* LOAD COMMENT */

    function loadComment(data) {
        fetch("/comment/getcomment",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            })
            .then(function (res) { return res.json() })
            .then(res => {
                if(res.code === 200) {
                    //console.log(res.comments);
                    post_id = '#block_comment_display' + data.post_id;
                    //console.log(post_id);
                    //$(post_id).empty();
                    comment_html = ''
                    for(var cmt of res.comments) {
                        comment_html +=
                            `<li class="comment_list_item" id="${cmt._id}">
                                <div class="comment_item">
                                    <img src="${cmt.author_avatar}" alt="avatar user" class="avatar_comment">
                                    <div class="content_comment">
                                        <div class="author_comment">
                                            <strong>${cmt.author_name}</strong>
                                        </div>
                                        <div class="comment">${cmt.comment_content}</div>
                                    </div>`
                        if(res.user._id.toString() === cmt.id_author || res.user.role === 'Admin') {
                            comment_html +=
                            `<div class="icon_otion_delete_update icon_otion_delete_update_comment" data-update_delete_option_comment="${cmt._id}">
                                <i class="fas fa-ellipsis-v"  data-update_delete_option_comment="${cmt._id}"></i>
                            </div>

                            <div class="option_comment" id="option_comment${cmt._id}">
                                <ul class="list_update_delete_option">
                                    <li class="item_update_delete_option_comment" data-comment_id="${cmt._id}" data-post_id_to_remove_comment="${data.post_id}">
                                        <i class="far fa-trash-alt" data-comment_id="${cmt._id}" data-post_id_to_remove_comment="${data.post_id}"></i>
                                        <p class="text_item_update_delete_option delete" data-comment_id="${cmt._id}" data-post_id_to_remove_comment="${data.post_id}">Xóa</p>
                                    </li>
                                </ul>
                            </div>`
                        }
                        comment_html +=            
                                `</div>
                            </li>`
                    }     
                    //console.log(post_id);
                    $(post_id).prepend(comment_html);
                }
                else{
                    console.log('error');
                }
            })
            .catch(function (res) { console.log(res) })
    }

    //REMOVE COMMENT

    $(document).on('click', '.item_update_delete_option_comment', e => {
        //e.stopPropagation();
        let comment_id = e.target.dataset.comment_id;
        //console.log({comment_id});
        let id_cmt_num= '#cmt_num' + e.target.dataset.post_id_to_remove_comment;
        console.log(id_cmt_num);
        $(id_cmt_num).text(parseInt($(id_cmt_num).text()) - 1);
        deleteComment({comment_id});
    });

    function deleteComment(data) {
        fetch('/comment/delete',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            })
            .then(function (res) { return res.json() })
            .then(res => {
                if(res.code === 200) {
                    console.log(res);
                    comment_id = '#' + res.comment_id;
                    $(comment_id).remove();   
                }
                else{
                    console.log('error');
                }
            })
            .catch(function (res) { console.log(res) })
    }

    //API LOAD TRANG
    let skip = 0;
    let load_page = false;
    
    $(window).scroll(function (e) {
        let check_infor = $('#check_InforLoad_Page').attr('data-page');
        //console.log(check_infor);
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            
            if(load_page === false) {
                skip ++;
                let url = '';
                let data;
                if(check_infor === 'homePage') {
                    url = '/load/timeline';
                    data = {skip};
                }
                else if(check_infor === 'userpage') {
                    let page_user_id = $('#check_InforLoad_Page').attr('data-user_page_id');
                    console.log(page_user_id)
                    data = {skip, page_user_id}
                    url = '/user/load/timeline';
                }
                loadPage(data, url);
            }
        }
    });

    function loadPage(data, url) {
        load_page = true;
        //console.log('URL: ', url)
        fetch(url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            })
            .then(function (res) { return res.json() })
            .then(res => {
                let posts = res.posts;
                let user = res.user;
                let list_new_posts = ``;
                for(let post of posts) {
                    list_new_posts +=
                    `<div class="card shadow-sm" id="${post._id}">
                        <div class="card-body">
                            <div class="header-content">
                                <img src="${post.avatar_image_src}" class="avatar-image" height="40px" width="40px">
                                <div class="info-post">
                                    <div class="user-name text">${post.author}</div>
                                </div>`
                            if(post.id_author===user._id.toString() || user.role === 'Admin'){
                                list_new_posts +=
                                `<div id="option_post">
                                    <div class="icon_otion_delete_update" data-update_delete_option="${post._id}">
                                        <i class="fas fa-ellipsis-v"  data-update_delete_option="${post._id}"></i>
                                    </div>
                                    
                                    <div class="update_delete_option" id="update_delete_option${post._id}">
                                        <ul class="list_update_delete_option">
                                            <li class="item_update_delete_option delete_post_option" data-post_id="${post._id}">
                                                <i class="far fa-trash-alt" data-post_id="${post._id}"></i>
                                                <p class="text_item_update_delete_option delete" data-post_id="${post._id}">Xóa</p>
                                            </li>
                                            <li class="item_update_delete_option edit_post_option" data-post_id="${post._id}">
                                                <i class="far fa-edit" data-post_id="${post._id}"></i>
                                                <p class="text_item_update_delete_option edit" data-post_id="${post._id}">Sửa</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>`
                            }
                            list_new_posts +=
                            `</div>
                                <div class="text-post">
                                    <p class="card-text text">${post.textContent}</p>
                                </div>
                            </div>`
                        if (post.image_src.length > 0) { 
                            list_new_posts += 
                            `<a href="/post/<%=post._id%>">
                                <img src="${post.image_src}" class="card-img-top" alt="...">
                            </a>`
                        }
                        if (post.video_id.length > 0) {
                            list_new_posts +=
                            `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${post.video_id}" title="Iframe Youtube"></iframe>`
                        }
                        list_new_posts +=
                        `<div class="card-body card-body-react-block">
                            <div class="react-infor">
                                <div class="react-infor__like">
                                    <i class="fas fa-thumbs-up"></i>&#8194<span class="text" id="like_num${post._id}">${post.like}</span>
                                </div>
                                <div class="react-infor__comment">
                                    <span class="text" id="cmt_num${post._id}">${post.comment}</span>&#8194<span>bình luận</span>
                                </div>
                            </div>
                            <div class="separate-line"></div>
                            <div class="btn-react">
                                <div class="btn-react__like" data-user_id="${user._id.toString()}" data-post_id="${post._id}"> 
                                    <i class="far fa-thumbs-up" data-user_id="${user._id}" data-post_id="${post._id}" id="like_btn${post._id}"></i>   
                                    <span class="text" data-user_id="${user._id}" data-post_id="${post._id}">Thích</span>		
                                </div>
                                <div class="btn-react__comment" data-post_id="${post._id}">
                                    <i class="far fa-comments" data-post_id="${post._id}"></i> <span class="text" data-post_id="${post._id}">Bình luận</span>
                                </div>
                            </div>
                            <div class="comment_place_block" id="comment_place_block${post._id}">
                                <div class="separate-line"></div>
                                <div class="comment_block">
                                    <div class="write_comment_blok">
                                        <img src="${user.avatar_img}" alt="avatar user" class="avatar_comment">
                                        <input type="email" class="form-control comment_input" placeholder="Viết bình luận của bạn" data-id_author="${user._id}" id="inputComment${post._id}" data-id_post="${post._id}" data-author_name="${user.display_name}" data-author_avatar="${user.avatar_img}">
                                    </div>

                                    <div class="list_comment_block">
                                        <ul class="comment_list" id="block_comment_display${post._id}">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
            $(".cotent-block").append(list_new_posts);
            load_page = false;
        });
    }

    /* edit page */
    $('#edit-name-btn').click(()=>{
        $('.formName').css('display', 'flex');
        $('.formAccount').css('display', 'none');
        $('.formAvatar').css('display', 'none');
    });

    $('#edit-account-btn').click(()=>{
        $('.formName').css('display', 'none');
        $('.formAccount').css('display', 'flex');
        $('.formAvatar').css('display', 'none');
    });

    $('#edit-avatar-btn').click(()=>{
        $('.formName').css('display', 'none');
        $('.formAccount').css('display', 'none');
        $('.formAvatar').css('display', 'flex');
    });
});