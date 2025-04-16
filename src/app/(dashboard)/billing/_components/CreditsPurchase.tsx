"use client";

import { PurchaseCredits } from "@/actions/billings/purchaseCredits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditsPack, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCard } from "lucide-react";
import { useState } from "react";

export default function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);
  const mutation = useMutation({
    mutationFn: PurchaseCredits,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CoinsIcon className="size-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={(value) => setSelectedPack(value as PackId)}>
          {CreditsPack.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex justify-between w-full cursor-pointer">
                <span className="font-bold">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  ${(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate(selectedPack);
          }}
        >
          <CreditCard className="mr-2 size-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
