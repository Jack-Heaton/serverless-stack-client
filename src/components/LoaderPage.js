import React from "react"
import { FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';
import "./LoaderPage.css";

export default function LoaderPage () {
return   (
    <div className="Loader">
        <div className="lander">
        <h1><Icon icon="sync-alt" spin/> Loading ...</h1>
        </div>
    </div>
  );
}