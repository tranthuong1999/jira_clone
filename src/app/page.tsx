import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"


const Home = () => {
    return (
        <div className="flex">
            <Input />
            <Button size="lg"> Default</Button>
            <Button variant="destructive"> Default</Button>
        </div>
    )
}

export default Home
