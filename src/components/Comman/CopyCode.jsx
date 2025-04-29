import React, { Fragment } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Copy, Loader2, X } from 'lucide-react';

const CodeBlock = ({ codeString, isCopyLoading, handleCopyCode }) => (
    <div className="relative px-6 rounded-md bg-black mb-2 pr-12">
        <div className="overflow-x-auto">
              <pre id="text" className="py-4 whitespace-pre text-[10px] text-white">
                {codeString}
              </pre>
        </div>

        <Button
            variant="ghost hover:none"
            className="absolute top-2 right-3 px-0"
            onClick={() => handleCopyCode(codeString)}
        >
            {isCopyLoading ? (
                <Loader2 size={16} className="animate-spin" color="white" />
            ) : (
                <Copy size={16} color="white" />
            )}
        </Button>
    </div>
);


const SetupGuideFooter = ({ theme }) => (
    <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
        Read the{' '}
        <Button variant="ghost" className="p-0 h-auto text-xs text-primary font-medium">
            Setup Guide
        </Button>{' '}
        for more information or{' '}
        <Button variant="ghost" className="p-0 h-auto text-xs text-primary font-medium">
            download the HTML example.
        </Button>
    </p>
);

const CopyCode = ({
                      open,
                      onOpenChange,
                      title,
                      description,
                      onClick,
                      codeString,
                      theme,
                      isCopyLoading,
                      handleCopyCode,
                      isWidget,
                      setSelectedType,
                      selectedType = 'script',
                  }) => {
    return (
        open && (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[350px] sm:max-w-[580px] bg-white rounded-lg p-3 md:p-6">
                    <DialogHeader className="flex flex-row justify-between gap-2">
                        <div className="flex flex-col gap-2">
                            <DialogTitle className={`font-medium ${theme === 'dark' ? 'text-card' : ''}`}>
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-left">
                                {description}
                            </DialogDescription>
                        </div>
                        <X
                            size={16}
                            className={`${theme === 'dark' ? 'text-card' : ''} cursor-pointer`}
                            onClick={onClick}
                        />
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {isWidget ? (
                            <Tabs defaultValue={selectedType} onValueChange={setSelectedType}>
                                <TabsList className="grid grid-cols-4 w-full bg-white mb-2 h-auto sm:h-10">
                                    <TabsTrigger value="script" className="font-normal">Script</TabsTrigger>
                                    <TabsTrigger className="whitespace-normal sm:whitespace-nowrap font-normal" value="embedlink">
                                        Embed Link
                                    </TabsTrigger>
                                    <TabsTrigger value="iframe" className="font-normal">iFrame</TabsTrigger>
                                    <TabsTrigger className="whitespace-normal sm:whitespace-nowrap font-normal" value="callback">
                                        Callback function
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="script" className="flex flex-col gap-2 m-0">
                                    <h4 className={`${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} text-sm`}>
                                        Place the code below before the closing body tag on your site.
                                    </h4>
                                    <CodeBlock
                                        codeString={codeString}
                                        isCopyLoading={isCopyLoading}
                                        handleCopyCode={handleCopyCode}
                                        theme={theme}
                                    />
                                    <SetupGuideFooter theme={theme} />
                                </TabsContent>

                                <TabsContent value="embedlink" className="space-y-2 m-0">
                                    <div className="space-y-2">
                                        <div className={`${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} text-sm`}>
                                            Follow these simple steps to embed the widget on any{' '}
                                            <Button variant="ghost" className="p-0 h-auto text-xs text-primary font-medium">
                                                supported website.
                                            </Button>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} pb-1`}>
                                                1. Copy the link below
                                            </p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} pb-1`}>
                                                2. Paste the link on any site where you want the widget to show.
                                            </p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} pb-1`}>
                                                3. That's it!
                                            </p>
                                        </div>
                                    </div>
                                    <CodeBlock
                                        codeString={codeString}
                                        isCopyLoading={isCopyLoading}
                                        handleCopyCode={handleCopyCode}
                                        theme={theme}
                                    />
                                    <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                                        Read the{' '}
                                        <Button variant="ghost" className="p-0 h-auto text-xs text-primary font-medium">
                                            Setup Guide
                                        </Button>{' '}
                                        for more information.
                                    </p>
                                </TabsContent>

                                <TabsContent value="iframe" className="flex flex-col gap-2 m-0">
                                    <div className={`${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} text-sm`}>
                                        Place the code below before the closing body tag on your site.
                                    </div>
                                    <CodeBlock
                                        codeString={codeString}
                                        isCopyLoading={isCopyLoading}
                                        handleCopyCode={handleCopyCode}
                                        theme={theme}
                                    />
                                    <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                                        Read the{' '}
                                        <Button variant="ghost" className="p-0 h-auto text-xs text-primary font-medium">
                                            Setup Guide
                                        </Button>{' '}
                                        for more information.
                                    </p>
                                </TabsContent>

                                <TabsContent value="callback" className="flex flex-col gap-2 m-0">
                                    <h4 className={`${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} text-sm`}>
                                        Place the code below before the closing body tag on your site.
                                    </h4>
                                    <CodeBlock
                                        codeString={codeString}
                                        isCopyLoading={isCopyLoading}
                                        handleCopyCode={handleCopyCode}
                                        theme={theme}
                                    />
                                    <SetupGuideFooter theme={theme} />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="space-y-2">
                                <h4 className={`${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} text-sm`}>
                                    Place the code below before the closing body tag on your site.
                                </h4>
                                <CodeBlock
                                    codeString={codeString}
                                    isCopyLoading={isCopyLoading}
                                    handleCopyCode={handleCopyCode}
                                    theme={theme}
                                />
                                <SetupGuideFooter theme={theme} />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            className={`text-sm font-medium border ${theme === 'dark' ? 'text-card' : 'text-card-foreground'}`}
                            onClick={onClick}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
};

export default CopyCode;