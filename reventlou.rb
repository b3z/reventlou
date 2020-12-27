cask "reventlou" do
    version "1.0.0"
    sha256 "1b20138236e51c3926b2bd92996f23ae0635353f41768337439f4185f089ce6d"
  
    url "https://github.com/b3z/reventlou/releases/download/#{version}/reventlou-#{version}-osx.dmg"
    appcast "https://github.com/b3z/reventlou/releases.atom"
    name "reventlou"
    desc "Personal database to store all type of things and simply find them again"
    homepage "https://github.com/b3z/reventlou"
  
    app "reventlou.app"
  end
  