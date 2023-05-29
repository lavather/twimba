import { tweetsData } from "./data.js";
import {v4 as uuidv4} from "https://jspm.dev/uuid";

var uuidOfTargetTweet=""

document.addEventListener("click", function(e){

    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id==="tweet-btn"){
        handleTweetBtnClick()
    }
    else if(e.target.id==="reply-btn"){
        handleTweetReplyClick(uuidOfTargetTweet)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
})

function handleLikeClick(x){

    const targetTweetObj=tweetsData.filter(function(tweet){
        return tweet.uuid===x
    })[0]
    if(targetTweetObj.isLiked){
        targetTweetObj.likes--     
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked=!targetTweetObj.isLiked
    render()
}

function handleRetweetClick(x){

    const targetTweetObj=tweetsData.filter(function(y){
        return y.uuid===x
    })[0]
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted=!targetTweetObj.isRetweeted
    render()
}

function handleReplyClick(x){
    
    document.getElementById(`replies-${x}`).classList.toggle("hidden")
    uuidOfTargetTweet=x
    console.log(uuidOfTargetTweet+"(this should be elons id)")
    
}

function handleDeleteClick(x){

    for(let n=0; n<tweetsData.length;n++){
        if (tweetsData[n].uuid===x){
            tweetsData.splice(n,1)
            break;
        }
    }
    render()
}

function handleTweetBtnClick(){
    
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        tweetsData.unshift({
            handle:"@Scrimba",
            profilePic:"images/scrimbalogo.png",
            likes:"0",
            retweets:"0",
            tweetText:tweetInput.value,
            replies:[],
            isLiked:false,
            isRetweeted:false,
            uuid:uuidv4()
            
        })

        render()
        tweetInput.value=""
        
    } 

    console.log(uuidOfTargetTweet +"(this should be empty)")
        
}

function handleTweetReplyClick(x){
    console.log(uuidOfTargetTweet+"this should have remembered elons id")
    console.log(x+"this should be the same number as above")
    const targetTweetObj=tweetsData.filter(function(y){
    
        return y.uuid === x
        
    })[0]
    console.log(targetTweetObj+"this should now give me an object")
    const tweetReplyInput = document.getElementById(`reply-input-${uuidOfTargetTweet}`)
    console.log(tweetReplyInput.value+"this should NOT be empty")
        if(tweetReplyInput.value){
            
            targetTweetObj.replies.unshift({
                handle: `@Scrimba ✅`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: tweetReplyInput.value,
            }); 
            
        } 
    const targetIndex = tweetsData.findIndex(function (tweet) {
        return tweet.uuid === x;
    });
          
    tweetsData[targetIndex] = targetTweetObj;
    render()
    console.log(targetTweetObj)       
}
      

function getFeedHtml(){
    let feedHTML=""
    tweetsData.forEach(function(tweets){
        let likeIconClass=""
        let retweetIconClass=""
        if(tweets.isLiked){
            likeIconClass="liked"
        }
        if(tweets.isRetweeted){
            retweetIconClass="retweeted"
        }

        let repliesHTML=""
        let deleteIcon=""
        if(tweets.handle ==="@Scrimba"){
                deleteIcon=`
                    <span class="tweet-detail">
                        <i class="fa-solid fa-trash" 
                        data-delete="${tweets.uuid}"></i>
                    </span>
                    `
        }
        if(tweets.replies.length>0){
            
            tweets.replies.forEach(function(reply){
                repliesHTML+=`
                            <div class="tweet-reply">
                                <div class="tweet-inner">
                                    <img src=${reply.profilePic} class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                        
                                    </div>
                                    
                                </div>
                            </div>

                            `
            })
        }
        
        let replyInputHTML=`<div class="tweet-reply tweet-inner">
                                <img src="images/scrimbalogo.png" class="profile-pic reply-pic">
                                <div>
                                    <textarea placeholder="Your Take On It?" id="reply-input-${uuidOfTargetTweet}"></textarea>
                                    <button id="reply-btn">Reply</button>
                                </div>
                            </div>`

        
        feedHTML+=
        `<div class="tweet">
            <div class="tweet-inner">
                <img src="${tweets.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweets.handle}</p>
                    <p class="tweet-text">${tweets.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweets.uuid}"></i>
                            ${tweets.replies.length}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweets.uuid}"></i>
                            ${tweets.likes}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweets.uuid}"></i>
                            ${tweets.retweets}
                        </span>
                        ${deleteIcon}
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweets.uuid}">
            ${replyInputHTML}
            ${repliesHTML}
            </div>
        </div>`
    })
    return feedHTML
    
}

function render(){
    document.getElementById("feed").innerHTML=getFeedHtml()
    
}



render()
    
