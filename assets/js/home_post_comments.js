// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
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


    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<section id="comment-${comment._id }">
        <div id="single-comment" style="border: 1px solid slategrey;  border-radius:0px 25px 25px 25px;;
        background: slategrey;
        padding: 20px; margin: 1em;" class="">
        <div id="post-author" > 
            <a href="#">
                <div>
                    <!-- <img
                        src="https://content.techgig.com/photo/75755485/Are-you-a-programmer-You-can-make-money-with-these-12-ideas-instantly.jpg"
                        alt="Image"
                    /> -->
                    <div>
                        <div>
                            <strong id="post-author-name">
                            ${comment.user.name }
                            </strong
                            >
                            <!-- <span>
                                <span>&nbsp;·&nbsp;</span>
                                1st</span
                            > -->
                        </div>
                        <span> Software Engineer</span
                        >
                        <span></span>
                    </div>
                    
                </div>
                <div>
                    
                    <a class="delete-comment-button" href="/comments/destroy/${comment._id}"><i class="fas fa-trash"></i></a>
                   
                </div>
            </a>
           
        </div> 
    <!-- </article> -->
    <div style="padding: 14px 14px 0;">
    ${comment.content}
    </div>
    
</div>
</section>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
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
}
















