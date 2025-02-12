export type IgPostInput = {
    url:string;
}

export type IgPostOutput = {
    username:string;
    post_date:string | Date | number;
    video:string;
    number_of_comments: string | number;
    number_of_likes: string | number;
    number_of_played: string | number;
    location:string;
    engagement_rate:string;
}

export type IgProfileInput = {
    url:string;
}

export type IgProfileOutput = {
    username:string;
    created_at:string | Date | number;
    last_post_date:string | Date| number;
    number_of_follower:string | number;
    number_of_following:string | number;
    location:string;
    email:string;
    phone:string | BigInt,
    engagement_rate:string
}

export type IgCommentsInput = {
    url:string;
    limit:number
}

export type IgCommentsOutput = {
    username:string;
    created_at:string | Date | number;
    last_post_date:string | Date| number;
    number_of_follower:string | number;
    number_of_following:string | number;
    location:string;
    email:string;
    phone:string | BigInt,
    engagement_rate:string
}

export type IgLikesInput = {
    url:string;
    limit:number
}

export type IgLikesOutput = {
    username:string;
    created_at:string | Date | number;
    last_post_date:string | Date| number;
    number_of_follower:string | number;
    number_of_following:string | number;
    location:string;
    email:string;
    phone:string | BigInt,
    engagement_rate:string
}