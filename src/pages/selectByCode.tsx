import { Button } from "@chakra-ui/react";
import Link from "next/link";
import DQ2 from "../components/lvltutor/Tools/DQ2";

export default function SelectByCode() {
  return (
    <>
      <div>
        <DQ2 />
      </div>
      <div>
        <Link href="showContent">
          <Button>Mostrar Ejercicio</Button>
        </Link>
      </div>
    </>
  );
}
