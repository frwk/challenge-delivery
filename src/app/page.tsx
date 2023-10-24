import { CalendarDateRangePicker } from '@/components/CalendarDateRangePicker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveriesChart } from '@/components/charts/DeliveriesChart';

export default function Home() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Nombre de livraisons</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DeliveriesChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Chart 2</CardTitle>
            <CardDescription>Description chart 2</CardDescription>
          </CardHeader>
          <CardContent>Contenu chart 2</CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chart 3</CardTitle>
          </CardHeader>
          <CardContent>Contenu chart 3</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chart 4</CardTitle>
          </CardHeader>
          <CardContent>Contenu chart 4</CardContent>
        </Card>
      </div>
    </div>
  );
}
