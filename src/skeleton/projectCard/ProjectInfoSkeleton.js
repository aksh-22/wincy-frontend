import React from 'react'
import { Skeleton } from '@material-ui/lab';

function ProjectInfoSkeleton() {
    return (
        <div>
    <div className="d_flex">
    <Skeleton variant="rect"  style={{width:50 , height : 50 , borderRadius:4 , marginRight:10}} />
    <Skeleton    style={{width:"100%" , height : 50 , borderRadius:4 , marginTop:-10}} />
    </div>
    <Skeleton    style={{width:"100%" , height : 20 , borderRadius:4 , marginTop:10}} />
    <div className="d_flex mt-1">
    <Skeleton   variant="rect" style={{width:70 , height : 30 , borderRadius:4 ,  marginRight:10 }} />
    <Skeleton   variant="rect" style={{width:70 , height : 30 , borderRadius:4 ,  marginRight:10 }} />
    <Skeleton   variant="rect" style={{width:70 , height : 30 , borderRadius:4 }} />
    </div>
        </div>
    )
}

export default ProjectInfoSkeleton
