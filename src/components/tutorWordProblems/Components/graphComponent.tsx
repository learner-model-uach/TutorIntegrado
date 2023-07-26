

import {Mafs, Coordinates, Point, Plot} from "mafs"

const GraphComp = () =>{

  return(
    <Mafs width="auto" viewBox={{x:[1979,1982], y:[0,7]}} preserveAspectRatio={false} >
      <Coordinates.Cartesian xAxis={{lines:1}} />
    </Mafs>
  )
}

export default GraphComp