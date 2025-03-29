import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import {prismaClient}  from "@/app/lib/db";
import { Stream } from "stream";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";



const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()

});

export async function POST(req:NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX)
        if (!isYt){
            return NextResponse.json({
                message:"url is not a youtube video",
            },{
                status:411
            })
        }
        const extractedId = data.url.split("?v=")[1];
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res.title);
        console.log(res.thumbnail.thumbnails);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a:{width: number},b: {width: number})=>a.width<b.width ?-1:1); 
        
        


        const stream =await prismaClient.stream.create({
           data:{
            userId:data.creatorId, 
            url:data.url,
            extractedId,
            type: "youtube",
            title: res.title ?? "cant find the video",
            smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://tse4.mm.bing.net/th?id=OIP.7ng8jCJZOZ8YC5Pfq4y1fgHaE8&pid=Api&P=0&h=180",
            bigImg: thumbnails[thumbnails.length - 1].url ?? "https://tse4.mm.bing.net/th?id=OIP.7ng8jCJZOZ8YC5Pfq4y1fgHaE8&pid=Api&P=0&h=180",
        }
    });
    return NextResponse.json({
        message: "Added stream",
        id: stream.id
    })
        
    }
    catch(e){
        return NextResponse.json({
            message:"error while creating stream",
        },{
            status:411
        })

    }
}
export async function GET(req:NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where:{
            userId:creatorId ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}
