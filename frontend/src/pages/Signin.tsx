import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

export function Signin(){
     return(
        <div>
          
            <div className="grid grid-cols-2">
            <div>
                <Auth type="signin"/>
                </div>
                <div className="invisible md:visible">
                <Quote/>
                </div>
          
            </div>
          
        </div>
     )
}