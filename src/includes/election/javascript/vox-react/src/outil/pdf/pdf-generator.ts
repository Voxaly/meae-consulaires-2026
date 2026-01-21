import {jsPDF} from 'jspdf';

export interface TextesPdf {
    titreOperationTour: string;
    logoClient: string;
    logoVote: string;
    titreBulletin: string;
    texteBulletin: string;
    signatureBulletin: string;
    cachetBulletin: string;
    logoCachet: string;
    cliquezIci: string;
    controleCachet: string;
    verifierCachetLien: string;
    texteAttention: string;
}

export class PdfGeneratorService {
    private static getTextes(): TextesPdf {
        return (window as any).textesPdf;
    }

    async generateRecepissePdf(): Promise<void> {
        const textes = PdfGeneratorService.getTextes();

        try {
            // Créer le document PDF
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Marges
            const leftMargin = 17;
            const rightMargin = 17;
            const topMargin = 17;
            const pageWidth = 210;
            const contentWidth = pageWidth - leftMargin - rightMargin;

            let yPosition = topMargin;

            // 1. Logo client - taille originale
            try {
                const logoClientBase64 = await this.loadImageAsBase64(textes.logoClient);

                // Créer une image temporaire pour obtenir les dimensions originales
                const tempImg = new Image();
                tempImg.src = logoClientBase64;

                await new Promise((resolve) => {
                    tempImg.onload = () => {
                        // Convertir pixels en mm et diviser par 2
                        const widthMm = (tempImg.width * 0.264583) / 3;
                        const heightMm = (tempImg.height * 0.264583) / 3;

                        // Ajouter l'image avec sa taille réduite
                        doc.addImage(logoClientBase64, 'PNG', leftMargin, yPosition, widthMm + 10, heightMm + 10);

                        // Ajuster yPosition en fonction de la hauteur réelle
                        yPosition += heightMm + 25;
                        resolve(null);
                    };
                });

            } catch (error) {
                console.warn('Impossible de charger le logo client:', error);
                yPosition += 10;
            }



            // 3. Logo vote et sous-titre
            try {
                const logoVoteBase64 = await this.loadImageAsBase64(textes.logoVote);
                doc.addImage(logoVoteBase64, 'PNG', leftMargin, yPosition - 10, 20, 20);
            } catch (error) {
                console.warn('Impossible de charger le logo vote:', error);
            }

            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            const titleLines = this.splitTextToFitWidth(doc, textes.titreOperationTour, contentWidth);
            titleLines.forEach(line => {
                doc.text(line, leftMargin + 23, yPosition);
                yPosition += 7;
            });

            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.text(textes.titreBulletin, leftMargin + 23, yPosition);
            yPosition += 15;

            // 4. Texte du bulletin
            try {
                const logoCachetBase64 = await this.loadImageAsBase64(textes.logoCachet);
                doc.addImage(logoCachetBase64, 'PNG', leftMargin, yPosition - 4, 6, 6);
            } catch (error) {
                console.warn('Impossible de charger le logo cachet:', error);
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            const texteLines = this.splitTextToFitWidth(doc, textes.texteBulletin, contentWidth - 10);
            texteLines.forEach(line => {
                doc.text(line, leftMargin + 7, yPosition);
                yPosition += 5;
            });

            // 5. Boîte d'information (simulée avec du texte)
            const rectHeight = 20;
            doc.setFillColor(246, 246, 246); // #E6E9F0
            doc.rect(leftMargin, yPosition, contentWidth, rectHeight, 'F');
            doc.line(leftMargin, yPosition + rectHeight, leftMargin + contentWidth, yPosition + rectHeight);

            // Utiliser jsPDF pour calculer automatiquement les lignes
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            // Découper le texte automatiquement selon la largeur de la boîte
            const cachetLines = doc.splitTextToSize(textes.cachetBulletin, contentWidth - 10);
            doc.text(cachetLines, leftMargin + 5, yPosition + 7);

            yPosition += rectHeight + 10;

            // 6. Lien de vérification
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0); // Noir pour le texte normal

            // Texte normal
            const normalText = `${textes.controleCachet} `;
            doc.text(normalText, leftMargin + 7, yPosition);

           // Calculer la position pour "cliquez ici"
            const normalTextWidth = doc.getTextWidth(normalText);
            const linkStartX = leftMargin + normalTextWidth + 7;

            // Texte du lien en bleu
            doc.setTextColor(0, 0, 255); // Bleu pour le lien
            doc.text(textes.cliquezIci, linkStartX, yPosition);

            // Construire l'URL complète si elle est relative
            let fullUrl = textes.verifierCachetLien;
            if (!fullUrl.startsWith('https://')) {
                const baseUrl = `${window.location.protocol}//${window.location.host}`;
                fullUrl = fullUrl.startsWith('/') ? baseUrl + fullUrl : baseUrl + '/' + fullUrl;
            }

            // Ajouter le cachet à l'URL
            const completeUrl = fullUrl + textes.cachetBulletin;

            // Ajouter le lien cliquable uniquement sur "cliquez ici"
            const linkWidth = doc.getTextWidth(textes.cliquezIci);
            doc.link(linkStartX, yPosition - 3, linkWidth, 5, {url: completeUrl});

            // 7. Message attention
            yPosition += 15;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);

            const texteAttention = this.splitTextToFitWidth(doc, textes.texteAttention, contentWidth - 10);
            texteAttention.forEach(line => {
                doc.text(line, leftMargin + 7, yPosition);
                yPosition += 5;
            });


            // Sauvegarder le PDF
            doc.save('Recepisse_de_vote.pdf');

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            throw error;
        }
    }

    private async loadImageAsBase64(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    private splitTextToFitWidth(doc: jsPDF, text: string, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = doc.getTextWidth(testLine);

            if (testWidth <= maxWidth) {
                currentLine = testLine;
            } else if (currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                // Mot trop long, on le coupe
                lines.push(word);
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }
}