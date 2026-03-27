import { AssigndUser } from "../components/startComponents/projectUser";
import { NewUser } from "../components/startComponents/noProjectUser";
import { useAuth } from "./../components/Auth";

export default function Start() {
  // const bgColor = "#2A4365";
  const { user } = useAuth();
  const proyecto = user?.projects?.some(x => x.code == "NivPreAlg");
  console.log(proyecto);

  return ( proyecto ? <AssigndUser /> : <NewUser />);
}
