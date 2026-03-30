import { Heading, Highlight, Stack, Text, Tabs } from "@chakra-ui/react";
import TopicTable from "../components/olm/TopicTable";
import ProgressOverTime from "../components/olm/ProgressOverTime";
import { ProgressOverTimeContainer } from "../components/olm/ProgressOverTimeChartTab";
import { FaBarsProgress } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";

export default function olmDashboard() {
    return (
        <>
            <Stack width="100%" padding="1rem" alignItems="center">
              <Heading as="h1" size="3xl" color={"heading"} mb={"1rem"} fontWeight="bold">Mi Progreso en Mateo</Heading>
              <Text pb="2rem" color={"text_info"}  fontWeight="medium" textStyle="md">
                <Highlight
                  query={["progreso", "llegar al 100%", "accentuate"]}
                  styles={{ 
                    px: "0.5", 
                    bg: { base:"teal.100", _dark:"teal.900"}, 
                    color: {base: "teal.600", _dark:"teal.500"},  
                    fontWeight: "semibold" }}
                >
                  Aquí podrás ver el porcentaje de tu progreso en todos los tópicos de Matemáticas que se
                  encuentran en Mateo. Cada vez que realices un ejercicio el porcentaje irá variando.
                  Recuerda que el objetivo es llegar al 100% en todos los tópicos
                </Highlight>
              </Text>
            </Stack>
          {/*'line' | 'subtle' | 'enclosed' | 'outline' | 'plain'*/}
              <Tabs.Root lazyMount unmountOnExit variant="outline" defaultValue="totalprogress" size="md">
                <Tabs.List>
                  <Tabs.Trigger value="totalprogress">
                    <FaBarsProgress />
                    <Text fontWeight="bold" color={"heading"}> Progreso por tópico </Text>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="progressovertime">
                    <GiProgression />
                    <Text fontWeight="bold">Evolución de mi progreso</Text>
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="totalprogress">
                  <TopicTable />
                </Tabs.Content>
                <Tabs.Content value="progressovertime">
                  <ProgressOverTimeContainer />
                  <ProgressOverTime endDate={new Date().toISOString()}/>
                </Tabs.Content>
              </Tabs.Root>
        </>
    );
}

