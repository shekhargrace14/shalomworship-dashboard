'use client';

import { Button } from '@/components/ui/button';

const SongCreditsForm = ({ initialData, handleBack, handleNext }: any) => {
    return (
        <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
                Back
            </Button>
            <Button onClick={handleNext}>Next: Manage Lyrics</Button>
        </div>
    );
};

export default SongCreditsForm;
