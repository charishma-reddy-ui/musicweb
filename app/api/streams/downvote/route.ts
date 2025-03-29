import { getServerSession } from "next-auth";
import { NextRequest,NextResponse } from "next/server";
import {z} from "zod";
import {prismaClient} from "@/app/lib/db";
const UpvoteSchema = z.object({
    streamId: z.string(),
    
});
export async function POST(req: NextRequest){
    const session = await getServerSession();
    if(!session?.user?.email){
        return NextResponse.json({
            message:"unauthorized"
        },{
            status:403
        })
    }
    const user = await prismaClient.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }

    });
    if(!user){
        return NextResponse.json({
            message:"Unauthenticated"
        },{
            status:403
        })
    }
    try{
        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where: {
                userId_streamId: {
                    userId:user.id,
                    streamId:data.streamId
                }
                
            }
        });
        return NextResponse.json({
            message: "Done!"
        })
}
catch(e){
  return NextResponse.json({    
    message:"error while upvoting",	
  },{
    status:403
  })

}
    }
  