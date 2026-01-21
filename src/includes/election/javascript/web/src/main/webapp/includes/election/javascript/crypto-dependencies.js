/**
 * JS permettant la génération du fichier "crypto.bundle.js".
 * Ce fichier contient les librairies utilisées pour le chiffrement
 * Pour ajouter une nouvelle librairie :
 * - Ajouter la librairie au fichier "package.json" (sous "dependencies") => nécessite un build maven du projet web
 * - Ajouter "require(librairie)" dans ce fichier
 */

module.exports = [
    './src/main/webapp/includes/libs/loria/extlib/es5-shim.js',
    './src/main/webapp/includes/libs/loria/extlib/sha256.js',
    './src/main/webapp/includes/libs/loria/extlib/jsbn.js',
    './src/main/webapp/includes/libs/loria/lib/shims.js',
    './src/main/webapp/includes/libs/loria/lib/utils.js',
    './src/main/webapp/includes/libs/loria/lib/maths/fp.js',
    './src/main/webapp/includes/libs/loria/lib/maths/point.js',
    './src/main/webapp/includes/libs/loria/lib/maths/operand.js',
    './src/main/webapp/includes/libs/loria/lib/maths/operandBignum.js',
    './src/main/webapp/includes/libs/loria/lib/maths/operandString.js',
    './src/main/webapp/includes/libs/loria/lib/maths/group-abstract.js',
    './src/main/webapp/includes/libs/loria/lib/maths/groupbigintmod.js',
    './src/main/webapp/includes/libs/loria/lib/maths/groupEcc.js',
    './src/main/webapp/includes/libs/loria/lib/crypto/proof.js',
    './src/main/webapp/includes/libs/loria/lib/crypto/elGamalCipherer.js',
    './src/main/webapp/includes/libs/loria/lib/crypto/cipherText.js',
    './src/main/webapp/includes/libs/loria/lib/crypto/iProofGenerator.js',
    './src/main/webapp/includes/libs/loria/lib/crypto/otherProofsGenerator.js',
    './src/main/webapp/includes/libs/loria/lib/groupParameters.js',
    './src/main/webapp/includes/libs/loria/lib/question.js',
    './src/main/webapp/includes/libs/loria/lib/election.js',
    './src/main/webapp/includes/libs/loria/lib/ballot.js',
    './src/main/webapp/includes/libs/loria/encryption_api.js'
];