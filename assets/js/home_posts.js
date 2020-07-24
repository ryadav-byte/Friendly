{   
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<article id="post-${post._id}">
        <div id="post-author">
            <a href="#">
                <div>
                    <img
                        src="https://content.techgig.com/photo/75755485/Are-you-a-programmer-You-can-make-money-with-these-12-ideas-instantly.jpg"
                        alt="Image"
                    />
                    <div>
                        <div>
                            <strong id="post-author-name">
                            ${post.user.name}
                            </strong
                            >
                            <span>
                                <span>&nbsp;·&nbsp;</span>
                                1st</span
                            >
                        </div>
                        <span> Software Engineer</span
                        >
                        <span>12h</span>
                    </div>
                </div>
            </a>
            <!-- <div>
                <span class="fas fa-circle"></span>
                <span class="fas fa-circle"></span>
                <span class="fas fa-circle"></span>
            </div> -->
            <div>
                
                <a class="delete-post-button" href="/posts/destroy/${post._id}"><i class="fas fa-trash"></i></a>
                
            </div>
        </div>
        <div id="post-data">
            <p>
            ${post.content}
            </p>
        </div>
        <div id="post-interactions">
            <div id="interactions-amount">
                <span
                    id="like-icon"
                    class="fas fa-thumbs-up fa-flip-horizontal"
                ></span>
               
                <span id="amount-info"
                    >23 <span>&nbsp;·&nbsp;</span> 4
                    Comments</span
                >
            </div>
            <div id="interactions-btns">
                <button>
                    <a style="color: black;" href="#collapseExample${post._id}" role="button" >
                        <span
                        class="far fa-thumbs-up fa-flip-horizontal"
                    ></span>
                    <span>Like</span>
                    </a>
                </button>
                <button>
                    <a style="color: black;" data-toggle="collapse" href="#collapseExample${post._id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                        <span
                        class="far fa-comment-dots fa-flip-horizontal"
                    ></span>
                    <span>Comment</span>
                    </a>
                    
                </button>
            </div>
        </div>
        <p>
    
          </p>
            <div class="collapse" id="collapseExample${post._id}">
            <form class="form-row" action="comments/create" method="POST">
                <div class=" mx-sm-3 mb-2 col-10">
                  
                  <input type="text" name="content" class="form-control" placeholder="Write a comment here..." required>
                  <input type="hidden" name="post" value="${post._id}">
                </div>
                <button style="background-color:#0091ca;" type="submit" class="btn btn-primary mb-2">Comment</button>
            </form>
           
          </div>
    </article>`);
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }


     // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
     let convertPostsToAjax = function(){
        $('#posts-list-container>article').each(function(){
            let self = $(this);
            let deleteButton = $('.delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}