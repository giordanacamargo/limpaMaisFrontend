import React from "react";
import {Button} from "primereact/button";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";

const SavedDialog = React.forwardRef(({
                                          headerMessage,
                                          message,
                                          icon,
                                          onListAll,
                                          onNew,
                                          labelListAll,
                                          labelNew
                                      }, ref) => {

    const confirm1 = () => {
        confirmDialog({
            group: 'headless',
            message: message,
            header: headerMessage,
            icon: icon,
            defaultFocus: 'accept',
            accept: onListAll,
            reject: onNew
        });
    };

    React.useImperativeHandle(ref, () => ({
        confirm1
    }));

    return (
        <>
            <ConfirmDialog
                group="headless"
                content={({headerRef, contentRef, footerRef, hide, message}) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div
                            className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className={icon}></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button
                                label={labelNew}
                                outlined
                                onClick={(event) => {
                                    hide(event);
                                    onNew();
                                }}
                                className="w-10rem"
                            />

                            <Button
                                label={labelListAll}
                                onClick={(event) => {
                                    hide(event);
                                    onListAll();
                                }}
                                className="w-10rem"
                            />
                        </div>
                    </div>
                )}
            />
        </>
    );
});

export default SavedDialog;
