import { useEffect, useRef } from 'react';
import * as BUI from '@thatopen/ui';

export default function BUIComponent() {
    const panelContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Ensure this only runs in the browser
        BUI.Manager.init();

        if (panelContainerRef.current) {
            const statelessPanelSection = BUI.Component.create<BUI.PanelSection>(() => {
                return BUI.html`
                  <bim-panel-section label="Stateless Panel Section">
                    <bim-color-input label="Color"></bim-color-input>
                  </bim-panel-section>
                `;
            });

            interface PanelSectionUIState {
                label: string;
                counter: number;
            }

            const [statefullPanelSection, updateStatefullPanelSection] =
                BUI.Component.create<BUI.PanelSection, PanelSectionUIState>(
                (state: PanelSectionUIState) => {
                    const { label, counter } = state;
                    const msg = `This panel section has been updated ${counter} ${counter === 1 ? "time" : "times"}`;
                    return BUI.html`
                    <bim-panel-section label=${label}>
                      <bim-label>${msg}</bim-label>
                    </bim-panel-section>
                  `;
                },
                { label: "Statefull Panel Section", counter: 0 },
            );

            const panel = BUI.Component.create<BUI.Panel>(() => {
                let counter = 0;
                const onUpdateBtnClick = () => {
                    counter++;
                    if (counter >= 5) {
                        updateStatefullPanelSection({
                            label: "Powered Statefull Panel Section 💪",
                            counter,
                        });
                    } else {
                        updateStatefullPanelSection({ counter });
                    }
                };

                return BUI.html`
                    <bim-panel label="My Panel">
                    <bim-panel-section label="Update Functions">
                        <bim-button @click=${onUpdateBtnClick} label="Update Statefull Section"></bim-button>
                    </bim-panel-section>
                    ${statelessPanelSection}
                    ${statefullPanelSection}
                    </bim-panel>
                `;
            });

            // Append the BUI panel to the React-controlled container
            panelContainerRef.current.append(panel);
        }

        // Cleanup function to dispose of the BUI components when unmounting
    }, []);

    return (
        <div className='absolute top-0 right-0' ref={panelContainerRef} />
    );
}
