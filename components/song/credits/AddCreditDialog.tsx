import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react';

const AddCreditDialog = ({ formData, updateField, handleBack, handleNext }: any) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Manage Credits</CardTitle>
        <CardDescription>Attribute the creators behind this piece.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input placeholder="Producer Name" value={formData.producer} onChange={(e) => updateField('producer', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Input placeholder="Songwriter Name" value={formData.songwriter} onChange={(e) => updateField('songwriter', e.target.value)} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Next: Manage Lyrics</Button>
      </CardFooter>
    </>
  );
};

export default AddCreditDialog;
