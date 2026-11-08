export interface SpecimenHotspot {
  id: string;
  name: string;
  sub: string;
  position: [number, number, number];
  description: string;
  fact: string;
}

export interface SpecimenEducationData {
  specimenId: string;
  scientificName: string;
  category: 'Anatomy' | 'Biology' | 'Cosmos' | 'Physics' | 'Engineering' | 'Zoology' | 'Nature';
  overview: string;
  hotspots: SpecimenHotspot[];
}

export const SPECIMEN_EDUCATIONAL_DB: Record<string, SpecimenEducationData> = {
  heart: {
    specimenId: 'heart',
    scientificName: 'Cor Humanum Anatomicum',
    category: 'Anatomy',
    overview: 'The human heart is a muscular organ about the size of a clenched fist. It beats roughly 100,000 times each day to pump oxygen-rich blood throughout your entire body.',
    hotspots: [
      {
        id: 'aorta',
        name: 'Aortic Arch',
        sub: 'Main Arterial Conduit',
        position: [-0.4, 2.5, 0.0],
        description: 'The aorta is the largest artery in your body. It receives high-pressure oxygenated blood directly from the left ventricle and curves overhead before supplying blood to your brain, arms, and torso.',
        fact: 'Under normal resting conditions, the aorta handles about 5 liters of blood every single minute.'
      },
      {
        id: 'left_ventricle',
        name: 'Left Ventricle & Apex',
        sub: 'High-Pressure Chamber',
        position: [-0.6, -1.8, 0.5],
        description: 'This is the most muscular chamber of the heart. Its walls are three times thicker than the right ventricle because it must generate enough force to push blood to your toes and fingertips.',
        fact: 'The apex of the heart points downward and to the left, which is why your heartbeat feels strongest on the left side of your chest.'
      },
      {
        id: 'pulmonary_trunk',
        name: 'Pulmonary Trunk',
        sub: 'Deoxygenated Conduit',
        position: [0.1, 1.4, 0.5],
        description: 'Emerging from the right ventricle, this vessel carries oxygen-poor blood to both lungs where carbon dioxide is released and fresh oxygen is absorbed.',
        fact: 'Pulmonary arteries are the only arteries in the adult human body that carry deoxygenated blood.'
      },
      {
        id: 'coronary_arteries',
        name: 'Coronary Arteries',
        sub: 'Myocardial Supply',
        position: [-0.2, -0.2, 1.4],
        description: 'These branching vessels wrap around the exterior surface of the heart muscle to supply cardiac tissue with its own continuous delivery of oxygen and nutrients.',
        fact: 'Even though blood flows continuously through the heart chambers, the heart muscle cannot absorb nutrients from the inside and relies entirely on these surface arteries.'
      }
    ]
  },

  brain: {
    specimenId: 'brain',
    scientificName: 'Cerebrum & Encephalon',
    category: 'Anatomy',
    overview: 'The human brain contains approximately 86 billion neurons connected by trillions of synapses, controlling thoughts, memory, movement, sensory perception, and basic survival functions.',
    hotspots: [
      {
        id: 'cerebral_cortex',
        name: 'Cerebral Cortex',
        sub: 'Gray Matter Surface',
        position: [0.0, 1.4, 0.0],
        description: 'The folded outer layer of the brain is organized into gyri (crests) and sulci (grooves). This convoluted geometry allows a huge surface area to fit compactly inside the protective cranium.',
        fact: 'If you unfolded all the wrinkles of a human cerebral cortex, it would cover an area roughly equivalent to a standard pillowcase.'
      },
      {
        id: 'frontal_lobe',
        name: 'Frontal Lobe',
        sub: 'Executive Control',
        position: [0.0, 0.8, 1.5],
        description: 'Situated at the front of the brain, this region handles decision making, planning, problem solving, voluntary muscle movements, personality expression, and emotional regulation.',
        fact: 'The frontal lobe is the last region of the human brain to fully mature, typically completing development in your mid-twenties.'
      },
      {
        id: 'cerebellum',
        name: 'Cerebellum',
        sub: 'Motor Coordinator',
        position: [0.0, -0.6, -1.2],
        description: 'Located at the lower back of the brain with fine horizontal folds, the cerebellum calculates muscle timing, balance, posture, and motor coordination.',
        fact: 'Despite accounting for only 10 percent of the brain volume, the cerebellum contains over half of all the neurons in your entire nervous system.'
      },
      {
        id: 'brainstem',
        name: 'Brainstem & Pons',
        sub: 'Autonomic Life Support',
        position: [0.0, -1.6, -0.3],
        description: 'The brainstem links the brain to the spinal cord. It controls involuntary reflexes necessary for life, such as heartbeat, breathing rate, swallowing, and blood pressure.',
        fact: 'Information travels along nerve fibers in the brainstem at speeds exceeding 250 miles per hour.'
      }
    ]
  },

  lungs: {
    specimenId: 'lungs',
    scientificName: 'Pulmo & Arbor Bronchialis',
    category: 'Anatomy',
    overview: 'The respiratory system exchanges oxygen from ambient air with carbon dioxide from venous blood across roughly 300 million microscopic alveoli inside both lungs.',
    hotspots: [
      {
        id: 'trachea',
        name: 'Trachea & C-Rings',
        sub: 'Primary Airway',
        position: [0.0, 2.6, 0.0],
        description: 'The trachea (windpipe) is reinforced with 16 to 20 stacked rings of hyaline cartilage. These flexible C-shaped rings prevent the airway from collapsing during breathing.',
        fact: 'The inside of the trachea is lined with microscopic hair-like cilia that sweep mucus and trapped particles upward away from your lungs.'
      },
      {
        id: 'bronchial_tree',
        name: 'Bronchial Arborization',
        sub: 'Air Distribution Network',
        position: [0.0, 0.8, 0.0],
        description: 'At the carina, the trachea divides into left and right primary bronchi. These branch repeatedly like inverted tree limbs into narrower bronchioles that reach every lobe.',
        fact: 'There are roughly 23 generations of branching divisions between your main trachea and the deepest terminal alveoli.'
      },
      {
        id: 'cardiac_notch',
        name: 'Cardiac Notch (Left Lung)',
        sub: 'Anatomical Accommodation',
        position: [-0.9, -0.4, 0.6],
        description: 'The left lung has only two lobes (superior and inferior) and features a distinct concave indent along its medial border to leave space for the resting heart apex.',
        fact: 'Because of the heart position, your left lung is about 10 percent smaller in volume than your right lung.'
      },
      {
        id: 'alveolar_base',
        name: 'Inferior Lobar Base',
        sub: 'Gas Exchange Zone',
        position: [1.6, -1.8, 0.0],
        description: 'The wide spongy base of each lung rests directly atop the dome-shaped diaphragm muscle, which contracts downward during inhalation to expand chest volume.',
        fact: 'The total surface area of all alveoli combined inside adult human lungs is roughly 75 square meters, about the size of half a tennis court.'
      }
    ]
  },

  eye: {
    specimenId: 'eye',
    scientificName: 'Oculus Humanus',
    category: 'Anatomy',
    overview: 'The human eye operates like a precision optical instrument. Light passes through the cornea and crystalline lens to form a focused inverted image on the light-sensitive retina.',
    hotspots: [
      {
        id: 'cornea',
        name: 'Cornea & Pupil',
        sub: 'Anterior Refractive Window',
        position: [0.0, 0.0, 2.3],
        description: 'The transparent dome on the front of the eye provides two-thirds of the optical focusing power. The central pupil widens or constricts via the iris to control light entry.',
        fact: 'The cornea is one of the only living human tissues that receives oxygen directly from the outside air rather than through blood vessels.'
      },
      {
        id: 'lens',
        name: 'Crystalline Lens',
        sub: 'Dynamic Focusing Element',
        position: [0.0, 0.0, 1.4],
        description: 'Suspended behind the iris, this flexible biconvex lens changes shape through tiny ciliary muscles to focus objects whether they are inches away or on the horizon.',
        fact: 'This optical accommodation process happens automatically thousands of times per day without conscious effort.'
      },
      {
        id: 'retina',
        name: 'Retinal Layer',
        sub: 'Photoreceptor Surface',
        position: [0.0, 1.4, -0.6],
        description: 'The rear interior wall is lined with over 120 million rod cells (for night vision and motion) and 6 million cone cells (for sharp daylight focus and full color vision).',
        fact: 'Photoreceptors convert incoming photons into electrochemical impulses that travel to your visual cortex in less than 13 milliseconds.'
      },
      {
        id: 'optic_nerve',
        name: 'Optic Nerve Cable',
        sub: 'Neural Highway',
        position: [-0.4, -0.2, -2.6],
        description: 'A bundle of over one million nerve fibers that carries visual signals directly from the retina into the brain for processing into perceived sight.',
        fact: 'Where the optic nerve exits the back of the eyeball, there are no photoreceptors, which creates a natural blind spot in each eye.'
      }
    ]
  },

  tooth: {
    specimenId: 'tooth',
    scientificName: 'Dens Molaris',
    category: 'Anatomy',
    overview: 'Molars are the large, flat teeth located at the back of the mouth, built with multi-layered mineral shields designed to crush and grind tough food fibers.',
    hotspots: [
      {
        id: 'enamel',
        name: 'Enamel Crown',
        sub: 'Mineral Shield',
        position: [0.0, 1.8, 0.0],
        description: 'The visible white part of the tooth is made of 96 percent crystalline hydroxyapatite minerals, making it the hardest biological substance in the human body.',
        fact: 'Unlike bone or skin tissue, mature tooth enamel has no living cells and cannot regenerate once worn away or damaged by acid.'
      },
      {
        id: 'pulp',
        name: 'Dental Pulp Chamber',
        sub: 'Living Vascular Core',
        position: [0.0, 0.2, 0.0],
        description: 'Beneath the dentin layer lies the soft pulp tissue containing blood vessels and nerve fibers that keep the tooth nourished, alive, and sensitive to temperature changes.',
        fact: 'Tooth pain occurs when the dental pulp becomes inflamed, sending sharp warning signals through the trigeminal nerve directly to the brain.'
      },
      {
        id: 'roots',
        name: 'Root Canals & Apex',
        sub: 'Anchoring Structure',
        position: [0.8, -2.0, 0.0],
        description: 'Tapered roots extend deep into the jawbone. Microscopic openings at the root tips (apical foramina) permit nerves and blood vessels to enter from the jaw.',
        fact: 'Teeth are anchored into alveolar bone by the periodontal ligament, a shock-absorbing network of collagen fibers that cushions biting forces.'
      }
    ]
  },

  kidney: {
    specimenId: 'kidney',
    scientificName: 'Ren Humanum',
    category: 'Anatomy',
    overview: 'The kidneys are bean-shaped filtration centers that continuously purify your blood, balance water and electrolytes, and regulate systemic blood pressure.',
    hotspots: [
      {
        id: 'renal_cortex',
        name: 'Renal Cortex',
        sub: 'Outer Filtration Zone',
        position: [1.6, 0.5, 0.0],
        description: 'The smooth outer layer houses millions of microscopic nephrons with glomerulus capillary balls that filter waste molecules out of incoming arterial blood.',
        fact: 'Your kidneys filter your entire bodily blood volume around 40 times each day, processing over 180 liters of fluid.'
      },
      {
        id: 'renal_pyramids',
        name: 'Medullary Pyramids',
        sub: 'Concentration Channels',
        position: [0.4, 0.2, 0.2],
        description: 'Triangular tissue segments inside the kidney that contain the Loops of Henle and collecting tubules where water and essential salts are reclaimed into circulation.',
        fact: 'More than 99 percent of the fluid filtered by your kidneys is reabsorbed back into your bloodstream, producing only 1 to 2 liters of urine daily.'
      },
      {
        id: 'renal_pelvis',
        name: 'Renal Pelvis & Ureter',
        sub: 'Drainage Funnel',
        position: [-0.9, -1.4, 0.0],
        description: 'Urine drains from minor and major calyces into this central funnel, which empties into the muscular ureter tube carrying waste down to the urinary bladder.',
        fact: 'Urine does not drain into the bladder by gravity alone; waves of muscular peristalsis propel fluid down the ureters even while you sleep horizontally.'
      }
    ]
  },

  bacteriophage: {
    specimenId: 'bacteriophage',
    scientificName: 'Phagus T4 Bacteriovorus',
    category: 'Biology',
    overview: 'Bacteriophages are specialized viruses that infect and destroy bacteria. They are among the most abundant biological entities on Earth and play a key role in natural ecosystem balance.',
    hotspots: [
      {
        id: 'capsid',
        name: 'Icosahedral Capsid Head',
        sub: 'Genomic Container',
        position: [0.0, 2.4, 0.0],
        description: 'A 20-sided geometric protein shell that encloses and pressurizes the viral DNA under intense physical force until it encounters a target bacterial cell.',
        fact: 'DNA inside the T4 capsid is packed at a pressure of roughly 50 atmospheres, about ten times higher than the air pressure inside a typical car tire.'
      },
      {
        id: 'sheath',
        name: 'Contractile Tail Sheath',
        sub: 'Injection Syringe',
        position: [0.0, 0.2, 0.0],
        description: 'A helical protein cylinder that acts like a microscopic spring. When triggered, the outer sheath contracts, thrusting an inner tube through the bacterial cell wall.',
        fact: 'This mechanical injection is one of the fastest and most efficient molecular injection systems discovered in biological nature.'
      },
      {
        id: 'tail_fibers',
        name: 'Tail Fibers & Baseplate',
        sub: 'Receptor Sensors',
        position: [1.4, -2.2, 0.0],
        description: 'Six jointed landing legs extending from the baseplate. They recognize and lock onto specific receptor molecules on the surface of target bacteria before anchoring.',
        fact: 'Doctors are using phages in phage therapy to treat bacterial infections that are resistant to all modern antibiotics.'
      }
    ]
  },

  dna: {
    specimenId: 'dna',
    scientificName: 'Helicis B-DNA Duplex',
    category: 'Biology',
    overview: 'Deoxyribonucleic acid carries the genetic blueprints used in growth, development, functioning, and reproduction of all known living organisms and many viruses.',
    hotspots: [
      {
        id: 'sugar_phosphate',
        name: 'Sugar-Phosphate Backbones',
        sub: 'Antiparallel Rails',
        position: [1.3, 1.2, 0.0],
        description: 'Two structural ribbons composed of alternating deoxyribose sugar and phosphate groups that spiral around a central axis in opposite directions.',
        fact: 'If you uncoiled the DNA strands inside all the cells of a single human body, they would stretch across the solar system and back.'
      },
      {
        id: 'base_pairs',
        name: 'Nucleotide Base Pair Rungs',
        sub: 'Genetic Alphabet',
        position: [0.0, 0.0, 0.0],
        description: 'Horizontal rungs formed by chemical hydrogen bonds between complementary bases: Adenine pairs exclusively with Thymine, while Guanine pairs exclusively with Cytosine.',
        fact: 'The human genome consists of approximately 3.2 billion base pairs stored compactly inside the microscopic nucleus of nearly every cell.'
      },
      {
        id: 'major_groove',
        name: 'Major & Minor Grooves',
        sub: 'Asymmetric Helix Surface',
        position: [-1.2, -1.6, 0.4],
        description: 'Because the base pairs attach at an angle, the helical cylinder forms alternating wide (major) and narrow (minor) grooves where proteins read genetic sequences without opening the helix.',
        fact: 'Transcription factors bind directly into the major groove to switch specific genes on or off during protein synthesis.'
      }
    ]
  },

  saturn: {
    specimenId: 'saturn',
    scientificName: 'Saturnus & Annuli',
    category: 'Cosmos',
    overview: 'The sixth planet from the Sun is a gas giant made primarily of hydrogen and helium, famous for its magnificent, extensive planetary ring system.',
    hotspots: [
      {
        id: 'cassini_division',
        name: 'Cassini Division Gap',
        sub: 'Orbital Resonance Void',
        position: [3.8, 0.0, 0.0],
        description: 'A dark, prominent 4,800-kilometer wide gap separating Ring A and Ring B. It is kept clear by the gravitational pull of Saturn moon Mimas, which clears out orbiting debris.',
        fact: 'Despite spanning nearly 300,000 kilometers across, Saturn rings are remarkably thin, averaging only about 10 to 30 meters in vertical thickness.'
      },
      {
        id: 'ring_b',
        name: 'Dense Ring B System',
        sub: 'Main Accretion Disk',
        position: [3.1, 0.0, 0.0],
        description: 'The brightest and most massive section of the rings, composed of countless billions of water ice particles ranging in size from tiny dust grains to house-sized boulders.',
        fact: 'The ice particles in the rings reflect sunlight with over 90 percent purity, giving them a brilliant silver and pale gold shimmer.'
      },
      {
        id: 'polar_bands',
        name: 'Atmospheric Jet Streams',
        sub: 'Zonal Wind Bands',
        position: [0.0, 1.2, 0.0],
        description: 'Rapidly circulating latitudinal wind bands in the upper atmosphere. Wind speeds near Saturn equator can exceed 1,800 kilometers per hour, five times faster than hurricane winds on Earth.',
        fact: 'At Saturn north pole sits a gigantic, persistent hexagonal jet stream large enough to fit two Earths side by side.'
      }
    ]
  },

  galaxy: {
    specimenId: 'galaxy',
    scientificName: 'Galaxia Spiralis Andromeda',
    category: 'Cosmos',
    overview: 'A barred spiral galaxy containing hundreds of billions of stars, interstellar gas, cosmic dust, and a supermassive black hole anchored at its gravitational center.',
    hotspots: [
      {
        id: 'galactic_bulge',
        name: 'Central Bulge & Core',
        sub: 'Stellar Concentration',
        position: [0.0, 0.0, 0.0],
        description: 'A dense, spherical hub packed with millions of ancient yellow and red stars orbiting tightly around a supermassive central black hole millions of times more massive than our Sun.',
        fact: 'Stars near the galactic core are packed so closely together that the night sky on an inner planet would shine brightly enough to read a book at midnight.'
      },
      {
        id: 'spiral_arms',
        name: 'Logarithmic Spiral Arms',
        sub: 'Density Wave Trails',
        position: [3.4, 0.0, 1.8],
        description: 'Curving bands of bright, young blue supergiant stars that trace rotating cosmic density waves moving through the galaxy disc.',
        fact: 'Spiral arms are not rigid structures like fan blades; they are moving traffic jams of gas and dust that trigger new star birth as material compresses.'
      },
      {
        id: 'emission_nebulae',
        name: 'H II Starburst Nebulae',
        sub: 'Stellar Nurseries',
        position: [-2.6, 0.0, -2.4],
        description: 'Vibrant pink and magenta clouds of ionized hydrogen gas where new star systems and exoplanets are actively condensing under gravity.',
        fact: 'Ultraviolet radiation from newborn stars excites surrounding hydrogen atoms, causing the gas to glow in characteristic magenta and rose frequencies.'
      }
    ]
  },

  earth: {
    specimenId: 'earth',
    scientificName: 'Terra Geologica',
    category: 'Cosmos',
    overview: 'Our home planet is composed of concentric geological shells, with a dynamic crust floating over a convective silicate mantle and an iron-nickel dynamo core.',
    hotspots: [
      {
        id: 'inner_core',
        name: 'Solid Inner Core',
        sub: 'Iron-Nickel Sphere',
        position: [0.0, 0.0, 0.0],
        description: 'A solid ball of iron and nickel at the center of the planet. Despite temperatures reaching 5,400 degrees Celsius, intense gravitational pressure prevents the metal from melting.',
        fact: 'The surface of the inner core is almost as hot as the surface of the Sun.'
      },
      {
        id: 'outer_core',
        name: 'Liquid Outer Core',
        sub: 'Geomagnetic Dynamo',
        position: [1.2, 0.0, 0.0],
        description: 'A churning ocean of molten iron and nickel 2,200 kilometers thick. Electric currents produced by this rotating liquid metal generate Earth protective magnetic field.',
        fact: 'Without Earth magnetic field, the solar wind would strip away our atmosphere and oceans, rendering the surface as barren as Mars.'
      },
      {
        id: 'crust_mantle',
        name: 'Continental Crust & Mantle',
        sub: 'Tectonic Lithosphere',
        position: [2.6, 0.0, 0.0],
        description: 'The outermost rocky shell, varying from 5 kilometers thick under oceans to 70 kilometers beneath mountain ranges, drifting slowly atop the semi-solid convecting mantle.',
        fact: 'Tectonic plates drift across Earth surface at roughly the same rate your fingernails grow, around a few centimeters per year.'
      }
    ]
  },

  rocket: {
    specimenId: 'rocket',
    scientificName: 'Astronautica Launch Vehicle',
    category: 'Engineering',
    overview: 'Multistage orbital launch vehicles use chemical combustion to achieve escape velocity, overcoming atmospheric drag and gravity to deliver satellites and humans into space.',
    hotspots: [
      {
        id: 'payload_fairing',
        name: 'Payload Fairing & Nose',
        sub: 'Aerodynamic Shell',
        position: [0.0, 3.4, 0.0],
        description: 'A streamlined aerodynamic clamshell that shields sensitive satellites and spacecraft from acoustic shockwaves and frictional heating during atmospheric ascent.',
        fact: 'Once the rocket leaves the dense lower atmosphere around 100 kilometers altitude, the fairing halves separate and fall away to shed unnecessary dead weight.'
      },
      {
        id: 'grid_fins',
        name: 'Hypersonic Grid Fins',
        sub: 'Steering Surfaces',
        position: [1.4, 1.8, 0.0],
        description: 'Lattice-shaped aerodynamic control fins that deploy during stage separation to guide and stabilize reusable rocket boosters as they hurtle backward through supersonic reentry.',
        fact: 'Grid fins remain effective at both hypersonic speeds (over Mach 4) and subsonic landing speeds without stalling.'
      },
      {
        id: 'rocket_engines',
        name: 'Engine Bell Cluster',
        sub: 'Propulsion Exhaust',
        position: [0.0, -1.2, 0.0],
        description: 'Contoured bell nozzles that expand high-pressure combustion gas into a directed high-velocity jet, producing millions of pounds of upward thrust by Newton third law.',
        fact: 'Propellant pumps in modern rocket engines generate thousands of horsepower, pumping tons of cryogenic propellant every second.'
      },
      {
        id: 'exhaust_plume',
        name: 'Supersonic Mach Diamonds',
        sub: 'Shockwave Patterns',
        position: [0.0, -2.6, 0.0],
        description: 'Luminous diamond-shaped shock patterns in the rocket exhaust plume caused by cyclic expansion and reflection of shockwaves as exhaust matches ambient air pressure.',
        fact: 'The distance between Mach diamonds changes as the rocket climbs into thinner air and ambient atmospheric pressure drops toward vacuum.'
      }
    ]
  },

  piston: {
    specimenId: 'piston',
    scientificName: 'Mechanica Piston & Crankshaft',
    category: 'Engineering',
    overview: 'The internal combustion piston assembly translates expanding gas pressure from fuel combustion into smooth rotational mechanical energy to drive vehicles and machinery.',
    hotspots: [
      {
        id: 'piston_crown',
        name: 'Piston Crown & Rings',
        sub: 'Combustion Chamber Surface',
        position: [0.0, 1.6, 0.0],
        description: 'The top surface of the piston absorbs the direct force of ignited fuel-air mixture. Split compression rings seal the cylinder wall to prevent power loss and oil leakage.',
        fact: 'In a modern automobile engine cruising on the highway, this piston oscillates up and down inside the cylinder over 50 times every single second.'
      },
      {
        id: 'connecting_rod',
        name: 'Connecting Rod (H-Beam)',
        sub: 'Motion Linkage',
        position: [0.3, -0.2, 0.0],
        description: 'A forged steel or titanium beam that links the reciprocating piston to the rotating crankshaft, enduring tremendous alternating compression and tension forces.',
        fact: 'Connecting rods are shaped with an H or I cross-section to maximize structural stiffness while minimizing reciprocating weight.'
      },
      {
        id: 'crankshaft',
        name: 'Crankshaft & Counterweight',
        sub: 'Rotational Conversion',
        position: [0.0, -1.8, 0.0],
        description: 'Offset crank pins convert linear up-and-down motion into rotating torque. Precision counterweights balance the reciprocating masses to eliminate destructive vibrations.',
        fact: 'Crankshaft bearings float on a microscopic film of pressurized oil, meaning the metal surfaces never actually touch while the engine runs.'
      }
    ]
  },

  jet: {
    specimenId: 'jet',
    scientificName: 'Turbofan Aero Engine',
    category: 'Engineering',
    overview: 'High-bypass turbofan engines power modern commercial aviation, combining quiet fuel efficiency with tremendous thrust through continuous thermodynamic Brayton cycles.',
    hotspots: [
      {
        id: 'fan_blades',
        name: 'Titanium Fan Blades',
        sub: 'Bypass Air Accelerator',
        position: [0.0, 0.0, 2.2],
        description: 'Aerodynamically twisted titanium blades that gulp tons of air per second. Over 80 percent of the air bypasses the engine core to provide quiet, highly efficient forward thrust.',
        fact: 'Modern commercial turbofan blades are hollow and forged from titanium alloys capable of withstanding bird strikes at 300 miles per hour.'
      },
      {
        id: 'compressor_core',
        name: 'Axial Compressor Core',
        sub: 'Pressure Multiplier',
        position: [0.0, 0.0, 0.4],
        description: 'Alternating spinning rotors and stationary stators compress incoming air up to 40 times its initial atmospheric pressure before it enters the combustor.',
        fact: 'Compressing air to such high ratios heats it up to over 600 degrees Celsius before any fuel is even injected or ignited.'
      },
      {
        id: 'combustor_turbine',
        name: 'Combustor & High-Pressure Turbine',
        sub: 'Thermal Power Plant',
        position: [0.0, 0.0, -1.2],
        description: 'Fuel injectors spray atomized kerosene into compressed air. The burning gas expands violently across single-crystal turbine blades to spin the front fan.',
        fact: 'Turbine blades operate in temperatures several hundred degrees hotter than the melting point of the metal itself, kept alive by internal cooling channels and ceramic thermal coatings.'
      }
    ]
  },

  rose: {
    specimenId: 'rose',
    scientificName: 'Rosa Floribunda Bouquet',
    category: 'Nature',
    overview: 'The rose is a classic angiosperm flowering plant whose multi-petaled blooms evolved to attract pollinating insects using rich visual colors and fragrant scent compounds.',
    hotspots: [
      {
        id: 'petals',
        name: 'Blooming Petal Whorls',
        sub: 'Corolla Layers',
        position: [0.0, 1.8, 0.0],
        description: 'Concentric spiral whorls arranged according to mathematical Fibonacci ratios. Petals contain anthocyanin pigments that produce warm coral, crimson, and blush hues.',
        fact: 'The spiraling pattern of rose petals allows maximum sunlight exposure to every layer while funneling morning dew toward the central reproductive stamen.'
      },
      {
        id: 'calyx',
        name: 'Calyx & Sepals',
        sub: 'Protective Foliage Collar',
        position: [0.0, 0.4, 0.0],
        description: 'A radiating green collar of sepals that encloses and protects the delicate floral bud during early development before spreading open during blooming.',
        fact: 'Sepals perform active photosynthesis, producing glucose energy locally to fuel the rapid expansion of the blooming flower head.'
      },
      {
        id: 'stem',
        name: 'Fibrous Stem Bundle',
        sub: 'Vascular Xylem Conduit',
        position: [0.0, -1.8, 0.0],
        description: 'Tough woody fibers containing xylem and phloem transport tubes that pull water and minerals up from the soil using capillary tension.',
        fact: 'What people commonly call thorns on a rose are botanically prickles, specialized outgrowths of the outer epidermis layer rather than true branches.'
      }
    ]
  },

  cloud: {
    specimenId: 'cloud',
    scientificName: 'Cumulus Congestus',
    category: 'Nature',
    overview: 'Cumulus clouds are volumetric convective formations that emerge when solar radiation warms Earth surface, causing humid air parcels to rise, expand, and condense aloft.',
    hotspots: [
      {
        id: 'cloud_crest',
        name: 'Convective Updraft Crest',
        sub: 'Solar Thermal Dome',
        position: [0.0, 1.8, 0.0],
        description: 'Bright billowy cauliflower domes pushed upward by strong vertical warm thermal currents. When humid air reaches the condensation altitude, water vapor turns into liquid droplets.',
        fact: 'Despite looking as light as cotton candy, a typical medium-sized cumulus cloud contains about 500,000 kilograms (1.1 million pounds) of water droplets.'
      },
      {
        id: 'cloud_base',
        name: 'Flat Condensation Base',
        sub: 'Lifting Condensation Level',
        position: [0.0, -1.2, 0.0],
        description: 'The sharp, flat bottom margin marks the exact altitude where rising air cools to its dew point temperature, triggering instant droplet nucleation on atmospheric aerosols.',
        fact: 'Cloud droplets are so light that slight updrafts of only a few miles per hour are enough to suspend millions of gallons of water in mid-air.'
      }
    ]
  },

  bust: {
    specimenId: 'bust',
    scientificName: 'Statua Humana',
    category: 'Nature',
    overview: 'A study of classical anatomical human sculpture, illustrating skeletal and muscular landmarks that define the human form in three-dimensional space.',
    hotspots: [
      {
        id: 'cranium',
        name: 'Cranial Plane & Facial Angle',
        sub: 'Skull Architecture',
        position: [0.0, 2.4, 0.4],
        description: 'The forehead, cheekbones (zygomatic arches), and jawline form the structural scaffolding that supports facial expression and sensory organs.',
        fact: 'The human skull is composed of 22 separate bones that fuse securely together during early childhood development.'
      },
      {
        id: 'neck',
        name: 'Sternocleidomastoid Column',
        sub: 'Cervical Musculature',
        position: [0.0, 1.1, 0.1],
        description: 'Diagonal muscle cords connecting the collarbones and sternum to the base of the skull, allowing the head to turn, flex, and tilt.',
        fact: 'The human neck contains seven cervical vertebrae, the exact same number found in giraffes and most other mammals.'
      },
      {
        id: 'chest',
        name: 'Clavicle & Pectoral Arch',
        sub: 'Thoracic Shoulder Girdle',
        position: [0.0, 0.0, 0.5],
        description: 'Horizontal collarbones act like biological struts holding the shoulder blades and arms out to the sides for full rotational freedom.',
        fact: 'The clavicle is one of the most frequently fractured bones in the human body because it absorbs direct shock transmitted from hands and arms.'
      }
    ]
  },

  atom: {
    specimenId: 'atom',
    scientificName: 'Atomus Quantum',
    category: 'Physics',
    overview: 'The fundamental building block of all chemical matter in the universe. A microscopic nucleus containing positive protons and neutral neutrons is encircled by quantized probability wave shells of electrons.',
    hotspots: [
      {
        id: 'nucleus',
        name: 'Atomic Nucleus',
        sub: 'Femtometer Core',
        position: [0.0, 0.0, 0.0],
        description: 'Packed with positively charged protons and neutral neutrons bound tightly by the residual strong nuclear force, counteracting electrostatic repulsion.',
        fact: 'Although the nucleus contains more than 99.9% of the atom mass, it occupies only about one ten-trillionth of its total physical volume.'
      },
      {
        id: 'orbitals',
        name: '1s & 2p Probability Shells',
        sub: 'Wave-Particle Envelopes',
        position: [1.8, 1.2, 0.5],
        description: 'Electrons do not orbit like planets. They exist as three-dimensional probability clouds called orbitals, defined by quantum wave functions.',
        fact: 'According to Heisenberg uncertainty principle, you can never simultaneously know both the exact position and velocity of an electron.'
      },
      {
        id: 'valence',
        name: 'Valence Electron Shell',
        sub: 'Chemical Reactivity Boundary',
        position: [-2.6, 1.8, -1.0],
        description: 'The outermost electron boundary that participates in chemical bonding, determining whether an element forms ionic or covalent compounds.',
        fact: 'Noble gases like neon and argon are chemically unreactive because their outermost valence electron shells are already completely full.'
      }
    ]
  },

  fusion: {
    specimenId: 'fusion',
    scientificName: 'Tokamak Toroidalis',
    category: 'Physics',
    overview: 'A magnetic confinement fusion device engineered to replicate the energy production of stars. Powerful magnetic fields trap swirling hydrogen isotope plasma at temperatures exceeding 100 million degrees Celsius.',
    hotspots: [
      {
        id: 'coils',
        name: 'D-Shaped Toroidal Field Coils',
        sub: 'Superconducting Magnetic Cage',
        position: [3.4, 0.8, 0.0],
        description: 'Giant electromagnets cooled near absolute zero that generate powerful magnetic fields to prevent the ultra-hot plasma from touching any physical walls.',
        fact: 'Superconducting coils in modern tokamaks carry millions of amperes of electrical current with zero electrical resistance.'
      },
      {
        id: 'plasma',
        name: 'Helical Core Plasma Torus',
        sub: 'Thermonuclear Core',
        position: [2.5, 0.0, 1.2],
        description: 'Deuterium and tritium gas heated until electrons detach from atomic nuclei, creating an electrically conductive ionized fluid swirling around the ring.',
        fact: 'The center of a fusion reactor burns hotter than the core of our Sun, which sits at roughly 15 million degrees Celsius.'
      },
      {
        id: 'divertor',
        name: 'Bottom Divertor Exhaust',
        sub: 'Heat Flux & Ash Extraction',
        position: [2.2, -2.1, 0.0],
        description: 'Heavy tungsten armor plates located at the bottom of the vacuum vessel designed to extract helium exhaust ash and withstand extreme heat.',
        fact: 'Tokamak divertor plates must withstand heat loads equivalent to the surface heat encountered by a space capsule re-entering Earth atmosphere.'
      }
    ]
  },

  blackhole: {
    specimenId: 'blackhole',
    scientificName: 'Kerr Singularis',
    category: 'Cosmos',
    overview: 'A region of spacetime where gravitational curvature becomes so extreme that nothing, not even electromagnetic radiation such as light, can escape once past the event horizon.',
    hotspots: [
      {
        id: 'horizon',
        name: 'Event Horizon',
        sub: 'Boundary of No Escape',
        position: [0.0, 0.0, 0.0],
        description: 'The mathematical threshold surrounding a black hole. At this point, the escape velocity equals the speed of light in vacuum.',
        fact: 'From an outside observer viewpoint, an object falling toward an event horizon appears to slow down and freeze forever due to gravitational time dilation.'
      },
      {
        id: 'photon_ring',
        name: 'Photon Sphere',
        sub: 'Orbital Light Boundary',
        position: [1.6, 0.0, 0.0],
        description: 'A spherical boundary at 1.5 times the Schwarzschild radius where gravity is so strong that photons of light are forced to travel in circular orbits.',
        fact: 'If you stood inside the photon sphere and pointed a flashlight horizontally, the light beam would circle the black hole and illuminate the back of your own head.'
      },
      {
        id: 'accretion_disk',
        name: 'Relativistic Accretion Disk',
        sub: 'Superheated Swirling Matter',
        position: [3.2, 0.1, 1.4],
        description: 'A swirling flattened disk of gas, plasma, and shredded matter orbiting the event horizon at up to ninety percent the speed of light.',
        fact: 'Frictional dissipation in the accretion disk converts gravitational energy into radiation so efficiently that black holes shine brighter than entire galaxies.'
      },
      {
        id: 'jets',
        name: 'Bipolar Relativistic Jets',
        sub: 'Magnetic Plasma Ejection',
        position: [0.0, 3.2, 0.0],
        description: 'Intense magnetic fields near the spinning event horizon channel ionized matter outward along rotation axes across thousands of light-years.',
        fact: 'These collimated jets launch plasma into deep intergalactic space at greater than 99% of the speed of light.'
      }
    ]
  },

  whale: {
    specimenId: 'whale',
    scientificName: 'Balaenoptera Musculus',
    category: 'Zoology',
    overview: 'The blue whale is the largest known animal to have ever lived on Earth, reaching lengths of up to 30 meters and masses exceeding 190 metric tons across global oceans.',
    hotspots: [
      {
        id: 'rostrum',
        name: 'Baleen Rostrum & Mouth',
        sub: 'Filter-Feeding Anatomy',
        position: [0.0, 0.3, 2.6],
        description: 'Instead of teeth, blue whales possess hundreds of fringed keratin plates called baleen that filter vast swarms of microscopic krill from seawater.',
        fact: 'A single mouthful of water engulfed by an adult blue whale can weigh up to 90 metric tons, roughly matching the weight of the whale itself.'
      },
      {
        id: 'pleats',
        name: 'Ventral Throat Pleats',
        sub: 'Expandable Accordion Folds',
        position: [0.0, -0.6, 1.2],
        description: 'Between 60 and 90 elastic grooves running along the throat and chest that expand dramatically like an accordion during lunging feeding runs.',
        fact: 'The nerve cables running along these pleats can stretch more than twice their resting length without sustaining cellular damage.'
      },
      {
        id: 'flukes',
        name: 'Caudal Tail Flukes',
        sub: 'Locomotive Hydrofoil Propulsor',
        position: [0.0, 0.0, -3.4],
        description: 'Broad, horizontal fibrous lobes driven by massive dorsal and ventral muscle cords, propelling the gigantic animal effortlessly through the open sea.',
        fact: 'Unlike fish that wag tails side to side, marine mammals propel themselves by undulating horizontal flukes vertically up and down.'
      }
    ]
  },

  rex: {
    specimenId: 'rex',
    scientificName: 'Tyrannosaurus Rex',
    category: 'Zoology',
    overview: 'The apex predator of Late Cretaceous North America around 66 million years ago. Its reinforced skull possessed the most powerful crushing bite force of any terrestrial animal in Earth history.',
    hotspots: [
      {
        id: 'antorbital',
        name: 'Antorbital Fenestra',
        sub: 'Weight-Reducing Cranial Cavity',
        position: [0.8, 0.4, 0.8],
        description: 'A large physiological opening in the skull located in front of the eye socket that drastically reduced skull weight while housing air sacs.',
        fact: 'Despite measuring nearly 1.5 meters in length, the skull remained lightweight and agile due to these strategic internal skeletal chambers.'
      },
      {
        id: 'teeth',
        name: 'Crushing Banana Teeth',
        sub: 'Bone-Shattering Dentition',
        position: [0.8, -0.4, 1.8],
        description: 'Up to 30 centimeters long including roots, these thick, oval, serrated teeth were shaped like reinforced spikes built specifically to puncture and pulverize solid bone.',
        fact: 'The bite force of an adult Tyrannosaurus rex reached an astounding 35,000 to 57,000 Newtons, capable of biting directly through triceratops pelvis bones.'
      },
      {
        id: 'dentary',
        name: 'Dentary Mandible & Suture',
        sub: 'Reinforced Lower Jaw',
        position: [0.9, -0.8, 0.2],
        description: 'Massive lower jaw bones featuring a flexible intramandibular joint that absorbed violent shocks whenever the predator clamped down on struggling prey.',
        fact: 'Microscopic wear patterns on T. rex jaw fossils confirm that lost or broken teeth were continually replaced throughout the animal lifetime.'
      }
    ]
  },

  nautilus: {
    specimenId: 'nautilus',
    scientificName: 'Nautilus Pompilius',
    category: 'Zoology',
    overview: 'A living fossil cephalopod that has inhabited tropical deep reefs for over 400 million years. Its buoyant shell is built according to precise logarithmic golden spiral geometry.',
    hotspots: [
      {
        id: 'spiral',
        name: 'Logarithmic Golden Spiral',
        sub: 'Equiangular Shell Geometry',
        position: [1.8, 1.6, 0.0],
        description: 'The shell curves outward in an equiangular spiral where each subsequent whorl grows proportionally in size without altering its original fundamental shape.',
        fact: 'The logarithmic spiral allows the animal to grow continuously inside its shell without ever needing to shed or rebuild its protective home.'
      },
      {
        id: 'chambers',
        name: 'Gas Camera Chambers',
        sub: 'Hydrostatic Buoyancy Tanks',
        position: [-0.6, 0.4, 0.0],
        description: 'Up to 30 sealed compartments divided by curved mother-of-pearl septa, filled with a precise mixture of gas and liquid to maintain neutral buoyancy at depth.',
        fact: 'The nautilus adjusts gas and fluid levels inside these sealed chambers like a biological submarine to ascend or descend without swimming.'
      },
      {
        id: 'siphuncle',
        name: 'Central Siphuncle Canal',
        sub: 'Osmotic Fluid Regulator',
        position: [0.1, 0.0, 0.0],
        description: 'A living cord of vascular tissue passing through the center of every partition wall, extracting salt ions to draw water out of newly formed chambers.',
        fact: 'The pressure-resistant shell allows a nautilus to dive safely to ocean depths exceeding 600 meters before hydrostatic crushing occurs.'
      }
    ]
  },

  neuron: {
    specimenId: 'neuron',
    scientificName: 'Neuron Pyramidalis',
    category: 'Biology',
    overview: 'The primary signaling cell of the central nervous system. Neurons receive electrical inputs across branching dendrites and transmit action potentials down an axon to communicate via chemical synapses.',
    hotspots: [
      {
        id: 'soma',
        name: 'Soma & Cell Nucleus',
        sub: 'Metabolic Control Center',
        position: [0.0, 1.8, 0.0],
        description: 'The pyramidal body containing the nucleus, endoplasmic reticulum, and mitochondria where protein synthesis and metabolic regulation take place.',
        fact: 'Unlike most cells in your skin or liver that regularly divide and replace themselves, most human brain neurons stay with you for your entire lifetime.'
      },
      {
        id: 'dendrites',
        name: 'Dendritic Arbor & Spines',
        sub: 'Input Signal Receptors',
        position: [1.4, 3.2, 0.4],
        description: 'Branching tree-like extensions covered with thousands of microscopic dendritic spines that receive chemical signals across synaptic junctions from neighboring cells.',
        fact: 'A single pyramidal neuron in the human cerebral cortex can receive inputs across more than 30,000 distinct synaptic connections.'
      },
      {
        id: 'myelin',
        name: 'Myelin Sheath & Nodes of Ranvier',
        sub: 'Insulating Saltatory Accelerator',
        position: [0.0, -0.6, 0.0],
        description: 'Lipid-rich insulating wraps separated by periodic gaps called Nodes of Ranvier, allowing nerve electrical pulses to hop rapidly down the axon cable.',
        fact: 'Myelinated nerve fibers transmit electrical impulses at up to 120 meters per second, compared to barely 1 meter per second in unmyelinated fibers.'
      },
      {
        id: 'synapse',
        name: 'Terminal Synaptic Bouton',
        sub: 'Neurotransmitter Release Hub',
        position: [0.0, -2.8, 0.0],
        description: 'The swollen bulb at the end of the axon packed with synaptic vesicles that release chemical messengers like glutamate, GABA, and dopamine across the synaptic cleft.',
        fact: 'The synaptic cleft separating two communicating neurons is only about 20 nanometers wide, roughly 5,000 times thinner than a single sheet of paper.'
      }
    ]
  },

  chloroplast: {
    specimenId: 'chloroplast',
    scientificName: 'Chloroplastis Viridis',
    category: 'Biology',
    overview: 'The photosynthetic power plant of plant and algal cells. Chloroplasts harness solar photons to convert carbon dioxide and water into energy-dense carbohydrates, generating oxygen as a byproduct.',
    hotspots: [
      {
        id: 'envelope',
        name: 'Double Membrane Envelope',
        sub: 'Endosymbiotic Boundary',
        position: [2.8, 1.4, 0.8],
        description: 'A lipid bilayer boundary consisting of a permeable outer membrane and a selectively permeable inner membrane, evidence of ancient endosymbiotic cyanobacterial origin.',
        fact: 'Chloroplasts retain their own circular DNA and ribosomes, proving they originated over 1.5 billion years ago when a primitive cell engulfed a cyanobacterium.'
      },
      {
        id: 'grana',
        name: 'Thylakoid Grana Stacks',
        sub: 'Light-Harvesting Membrane Discs',
        position: [0.2, 0.2, 0.0],
        description: 'Columns of flattened membrane discs embedded with chlorophyll pigment clusters and electron transport chains that absorb sunlight and split water molecules.',
        fact: 'Chlorophyll molecules appear green to human eyes because they absorb blue and red wavelengths of light while reflecting green light back.'
      },
      {
        id: 'stroma',
        name: 'Stroma Matrix Fluid',
        sub: 'Calvin Cycle Biosynthesis',
        position: [-1.2, -0.8, -0.4],
        description: 'The dense alkaline aqueous fluid surrounding the grana stacks, containing soluble enzymes like RuBisCO that fix carbon dioxide into sugars during the light-independent reactions.',
        fact: 'RuBisCO, the primary carbon-fixing enzyme located inside the chloroplast stroma, is the single most abundant protein on planet Earth.'
      }
    ]
  },

  ear: {
    specimenId: 'ear',
    scientificName: 'Organum Vestibulocochleare',
    category: 'Anatomy',
    overview: 'The human peripheral hearing and equilibrium apparatus. It funnels airborne pressure waves, amplifies them mechanically through miniature auditory ossicles, and analyzes sound frequencies along the spiral cochlea.',
    hotspots: [
      {
        id: 'pinna',
        name: 'Auricle & Concha Cartilage',
        sub: 'Acoustic Directional Collector',
        position: [1.2, 0.8, 0.6],
        description: 'The outer elastic cartilage framework that collects acoustic pressure waves and introduces directional frequency notches that help the brain localize whether sound sources are in front or behind.',
        fact: 'The specific folds and valleys of your outer ear pinna are as unique to you as your fingerprints, creating individual acoustic signatures.'
      },
      {
        id: 'eardrum',
        name: 'Tympanic Membrane',
        sub: 'Acoustic Transduction Drumhead',
        position: [-0.9, -0.4, -0.6],
        description: 'A translucent, conical three-layer fibrous membrane positioned at the end of the auditory canal that vibrates in response to minute air pressure fluctuations.',
        fact: 'The human eardrum can detect sound pressure variations that deflect its surface by less than the diameter of a single hydrogen atom.'
      },
      {
        id: 'ossicles',
        name: 'Auditory Ossicles (Malleus, Incus, Stapes)',
        sub: 'Impedance Matching Lever Chain',
        position: [-1.2, -0.2, -0.9],
        description: 'The three smallest bones in the human body, acting as a mechanical lever system that amplifies acoustic force by approximately twenty times to overcome acoustic resistance into inner ear fluid.',
        fact: 'The stapes bone in your middle ear measures barely 3 millimeters in length, making it smaller than a grain of rice.'
      },
      {
        id: 'cochlea',
        name: 'Spiral Cochlea (2.75 Turns)',
        sub: 'Tonotopic Frequency Analyzer',
        position: [-1.8, -0.5, -1.2],
        description: 'A mathematical logarithmic spiral fluid chamber lined with roughly twenty thousand sensory hair cells, mapping high frequency sounds at its base and low pitch tones at its apex.',
        fact: 'Hair cells inside the cochlea do not regenerate in humans, so loud acoustic exposure can cause irreversible hearing loss over time.'
      }
    ]
  },

  knee: {
    specimenId: 'knee',
    scientificName: 'Articulatio Genus',
    category: 'Anatomy',
    overview: 'The largest and most heavily loaded synovial joint in the human body. The knee operates as a modified bicondylar hinge joint that rolls, slides, and rotates under muscular control.',
    hotspots: [
      {
        id: 'condyles',
        name: 'Femoral Bicondylar Runners',
        sub: 'Articular Rolling Surfaces',
        position: [0.8, -0.1, -0.2],
        description: 'Dual convex rounded cartilage surfaces of the distal femur that roll and slide atop the tibial plateau, coated with glassy hyaline cartilage for low friction.',
        fact: 'Healthy hyaline articular cartilage in the knee joint is about five times more slippery than ice skating over ice.'
      },
      {
        id: 'patella',
        name: 'Patella Sesamoid Kneecap',
        sub: 'Quadriceps Lever Arm Multiplier',
        position: [0.0, 0.5, 1.3],
        description: 'A shield-shaped bone embedded within the quadriceps tendon that slides inside the femoral trochlear groove, increasing knee extension torque efficiency by thirty percent.',
        fact: 'Babies are born with patellae made of soft cartilage that do not fully ossify into hard bone until between three and five years of age.'
      },
      {
        id: 'meniscus',
        name: 'Medial & Lateral Menisci',
        sub: 'Fibrocartilage Shock Absorbers',
        position: [-0.7, -0.5, 0.0],
        description: 'Crescent-shaped fibrocartilaginous pads that distribute compressive weight across the tibial plateau and lubricate joint motion.',
        fact: 'During running or jumping, the knee menisci absorb compressive peak loads exceeding five to eight times total human body weight.'
      },
      {
        id: 'cruciate',
        name: 'Cruciate Ligaments (ACL & PCL)',
        sub: 'Rotational & Anterior-Posterior Stabilizers',
        position: [0.0, -0.3, 0.0],
        description: 'Two dense collagen bands crossing in an X pattern inside the center of the joint, preventing the tibia from sliding forwards or backwards relative to the femur.',
        fact: 'The anterior cruciate ligament provides eighty-five percent of the total restraining force against forward displacement of the lower leg.'
      }
    ]
  },

  mitochondrion: {
    specimenId: 'mitochondrion',
    scientificName: 'Mitochondrion Cellulare',
    category: 'Biology',
    overview: 'The bioenergetic engine of eukaryotic cells. Mitochondria generate adenosine triphosphate through oxidative phosphorylation while regulating cellular metabolism and programmed cell death.',
    hotspots: [
      {
        id: 'cristae',
        name: 'Folded Inner Membrane Cristae',
        sub: 'Proton Gradient Surface Area',
        position: [-0.1, 0.3, 0.4],
        description: 'Deep transverse accordion folds of the inner membrane packed with respiratory enzyme complexes that pump hydrogen protons into the intermembrane space.',
        fact: 'The extensive folding of cristae expands the inner membrane surface area inside a typical liver cell to thousands of square meters.'
      },
      {
        id: 'atpsynthase',
        name: 'ATP Synthase Molecular Rotors',
        sub: 'Electrochemical Rotary Motors',
        position: [0.4, 0.4, -0.6],
        description: 'Nanoscale biological turbines that spin at thousands of revolutions per minute as protons flow through them, synthesizing ATP chemical fuel for the body.',
        fact: 'Your body synthesizes roughly its own entire body weight in ATP molecules every single day through these spinning molecular turbines.'
      },
      {
        id: 'mtdna',
        name: 'Circular Mitochondrial DNA (mtDNA)',
        sub: 'Maternally Inherited Genome',
        position: [0.2, -0.1, 0.2],
        description: 'Autonomous circular DNA molecules and ribosomes within the matrix fluid, direct descendants of an alpha-proteobacterium engulfed two billion years ago.',
        fact: 'Human mitochondrial DNA is inherited almost exclusively through the maternal lineage, passed from mother to children across generations.'
      }
    ]
  },

  virus: {
    specimenId: 'virus',
    scientificName: 'Coronaviridae Virion',
    category: 'Biology',
    overview: 'An enveloped positive-sense single-stranded RNA virus. The virion features a protective lipid bilayer envelope studded with trimeric spike glycoproteins that bind host cell receptors.',
    hotspots: [
      {
        id: 'spike',
        name: 'Trimeric S Spike Glycoproteins',
        sub: 'Receptor Binding Crown',
        position: [0.0, 2.4, 0.0],
        description: 'Crown-like protruding trimers containing S1 attachment domains and S2 fusion machinery that bind to host receptor proteins like ACE2 to trigger viral entry.',
        fact: 'The name coronavirus derives from the Latin corona meaning crown, referencing the regal fringe of spike proteins visible under electron microscopy.'
      },
      {
        id: 'envelope',
        name: 'Host-Derived Lipid Bilayer Envelope',
        sub: 'Fragile Protective Membrane',
        position: [0.0, 1.3, 0.0],
        description: 'A spherical lipid bilayer acquired from the host endoplasmic reticulum, making the virus susceptible to ordinary soaps and alcohol sanitizers that dissolve lipids.',
        fact: 'Washing hands with simple soap and warm water dismantles the virus because soap molecules break down its lipid bilayer outer shell.'
      },
      {
        id: 'core',
        name: 'Helical Ribonucleoprotein RNA Core',
        sub: 'Positive-Sense Genetic Blueprint',
        position: [0.0, 0.0, 0.0],
        description: 'A packed coil of genomic RNA wrapped in nucleocapsid proteins, carrying approximately thirty thousand nucleotide bases of instructions to hijack host cell machinery.',
        fact: 'Coronaviruses possess one of the largest single-stranded RNA genomes in the biological world, roughly three times longer than that of influenza.'
      }
    ]
  },

  microchip: {
    specimenId: 'microchip',
    scientificName: 'Microprocessor System-on-Chip',
    category: 'Engineering',
    overview: 'A monolithic silicon integrated circuit packing billions of nanoscale transistors into layered logic cores, memory caches, and high-speed data buses operating at gigahertz clock speeds.',
    hotspots: [
      {
        id: 'cores',
        name: 'Multi-Core CPU Execution Units',
        sub: 'Arithmetic Logic & Branch Execution',
        position: [-1.2, 0.1, 0.9],
        description: 'Independent processing cores containing arithmetic logic units, registers, and instruction decoders capable of executing billions of operations every second.',
        fact: 'Modern microprocessors pack more than fifty billion transistors onto a piece of silicon barely the size of a postage stamp.'
      },
      {
        id: 'cache',
        name: 'Shared L3 SRAM Cache Array',
        sub: 'Ultra-Fast On-Die Memory',
        position: [0.0, 0.1, 0.0],
        description: 'Dense banks of static RAM providing fast data access within a few clock cycles, reducing delays from communicating with slower off-die system memory.',
        fact: 'Signals traveling across on-die SRAM cache take less than one nanosecond, during which light travels only about thirty centimeters in vacuum.'
      },
      {
        id: 'bus',
        name: 'Interconnect Metal Routing Buses',
        sub: 'Multi-Layer Copper Circuit Highways',
        position: [0.9, 0.1, -0.9],
        description: 'Up to fifteen vertical layers of copper and cobalt traces that link transistors, carrying binary data packets and clock synchronizing signals.',
        fact: 'The total length of microscopic copper wiring interconnects inside a single advanced microchip can exceed sixty kilometers.'
      },
      {
        id: 'pads',
        name: 'Wire Bond & Microbump I/O Pads',
        sub: 'Packaging Signal Interface',
        position: [2.3, 0.0, 0.0],
        description: 'Gold and solder connection points arrayed around the die perimeter, bridging microscopic on-chip circuitry to outer circuit board traces.',
        fact: 'Modern advanced packaging uses microscopic copper pillars smaller than twenty micrometers to connect stacked dies vertically in three dimensions.'
      }
    ]
  },

  collider: {
    specimenId: 'collider',
    scientificName: 'Detector Particle Collider',
    category: 'Physics',
    overview: 'A massive multi-layer particle detector engineered to reconstruct subatomic debris created when relativistic protons collide head-on at nearly the speed of light.',
    hotspots: [
      {
        id: 'pipe',
        name: 'Ultra-High Vacuum Beam Pipe',
        sub: 'Relativistic Particle Highway',
        position: [0.0, 0.0, 0.0],
        description: 'A beryllium vacuum pipe where counter-circulating bunches of protons collide at ninety-nine point nine nine nine nine nine nine percent of light speed.',
        fact: 'The beam vacuum inside the Large Hadron Collider is emptier than interplanetary space, maintained at ten times lower pressure than the surface of the Moon.'
      },
      {
        id: 'tracker',
        name: 'Silicon Pixel Vertex Tracker',
        sub: 'Sub-Micron Track Reconstruction',
        position: [0.4, 0.4, 0.0],
        description: 'Layers of silicon pixel sensors that record the precise spatial coordinates of charged particles without substantially deflecting their forward momentum.',
        fact: 'The inner silicon tracker captures up to forty million collision frames every second, filtering petabytes of raw data down to interesting events.'
      },
      {
        id: 'calorimeter',
        name: 'Liquid Argon & Tile Calorimeters',
        sub: 'Total Particle Energy Absorption',
        position: [1.4, 0.8, 0.0],
        description: 'Dense absorber plates interspersed with active detector material that stop electrons, photons, and hadrons to measure their total kinetic energy.',
        fact: 'Calorimeters use dense lead, liquid argon, and brass absorbers to completely bring high-energy particles to rest and absorb their total momentum.'
      },
      {
        id: 'muon',
        name: 'Superconducting Muon Toroid Coils',
        sub: 'Magnetic Spectrometer Precision',
        position: [2.4, 0.0, 0.0],
        description: 'Giant superconducting coils creating a strong toroidal magnetic field to bend penetrating muon particles and compute their momentum.',
        fact: 'Muons can penetrate meters of solid iron and concrete, making them the only charged particles that reach the outer spectrometer chambers intact.'
      }
    ]
  },

  jwst: {
    specimenId: 'jwst',
    scientificName: 'James Webb Space Telescope',
    category: 'Engineering',
    overview: 'The premier infrared space observatory in orbit around the Sun-Earth Lagrange Point 2. JWST peers through cosmic dust to capture the earliest stars and galaxies formed after the Big Bang.',
    hotspots: [
      {
        id: 'mirror',
        name: '18-Segment Gold Primary Mirror',
        sub: 'Beryllium Hexagonal Array',
        position: [0.0, 0.0, 0.6],
        description: 'A six and a half meter aperture array of eighteen lightweight beryllium hexagons coated with a microscopic layer of pure gold optimized to reflect infrared light.',
        fact: 'All eighteen mirror segments combined are coated with barely four grams of pure gold, about the mass of a typical wedding ring, spread just one hundred nanometers thin.'
      },
      {
        id: 'secondary',
        name: 'Secondary Mirror & Tripod',
        sub: 'Infrared Beam Reflector',
        position: [0.0, 0.0, 2.4],
        description: 'A convex secondary reflector held seven meters in front of the primary array by three carbon composite struts, directing focused starlight back into science instruments.',
        fact: 'Computer-controlled micro-actuators align each primary mirror segment with precision finer than one ten-thousandth the thickness of a human hair.'
      },
      {
        id: 'sunshield',
        name: 'Five-Layer Diamond Sunshield',
        sub: 'Cryogenic Thermal Barrier',
        position: [0.0, 1.4, -0.3],
        description: 'A tennis-court-sized kite of five Kapton polymer membranes coated with aluminum and silicon, cooling science instruments passively below minus two hundred thirty degrees Celsius.',
        fact: 'The sunshield creates a temperature differential of over three hundred degrees Celsius between its warm sunward side and its freezing dark side.'
      },
      {
        id: 'bus',
        name: 'Spacecraft Service Bus',
        sub: 'Power, Navigation & Data Relay',
        position: [0.0, -1.2, -0.7],
        description: 'The core module housing star trackers, reaction control thrusters, solar array, batteries, and the high-gain antenna communicating with Earth via NASA Deep Space Network.',
        fact: 'JWST orbits the second Lagrange point one and a half million kilometers from Earth, four times further away than the orbit of the Moon.'
      }
    ]
  },

  magnetosphere: {
    specimenId: 'magnetosphere',
    scientificName: 'Magnetosphaera Terrestris',
    category: 'Cosmos',
    overview: 'The protective geomagnetic bubble created by Earth convective liquid outer core dynamo, deflecting the energetic solar wind and trapping relativistic cosmic particles.',
    hotspots: [
      {
        id: 'bowshock',
        name: 'Supersonic Solar Wind Bow Shock',
        sub: 'Plasma Deceleration Boundary',
        position: [2.2, 0.0, 0.0],
        description: 'A standing collisionless shock wave where supersonic solar wind ions traveling at four hundred kilometers per second suddenly decelerate and deflect around Earth.',
        fact: 'Without the geomagnetic field and bow shock, intense solar wind particles would strip away Earth atmosphere and oceans over geological time, as occurred on Mars.'
      },
      {
        id: 'vanallen',
        name: 'Van Allen Radiation Belts',
        sub: 'Relativistic Particle Toroids',
        position: [1.4, 0.0, 0.0],
        description: 'Inner proton and outer electron toroidal radiation belts held trapped within Earth magnetic bottle, oscillating between northern and southern mirror points.',
        fact: 'Spacecraft flying through the Van Allen radiation belts require heavy radiation shielding to prevent high-energy ions from destroying sensitive electronics.'
      },
      {
        id: 'dipole',
        name: 'Dipolar Magnetic Field Loops',
        sub: 'Geodynamo Shield Lines',
        position: [0.0, 1.8, 0.0],
        description: 'Closed geomagnetic field loops emerging from the southern magnetic pole and looping into the northern magnetic pole, funneling charged particles into glowing polar auroras.',
        fact: 'Earth magnetic field is generated deep within the planet by the swirling convection of molten iron and nickel inside the liquid outer core.'
      }
    ]
  },

  tornado: {
    specimenId: 'tornado',
    scientificName: 'Vortex Atmosphaericus',
    category: 'Physics',
    overview: 'A violently rotating atmospheric column of air touching both a thunderstorm base and the ground. Tornadic vortex dynamics combine intense cyclonic spin with extreme vertical updraft suction.',
    hotspots: [
      {
        id: 'funnel',
        name: 'Condensation Funnel Core',
        sub: 'Extreme Pressure Drop Axis',
        position: [0.0, -0.5, 0.0],
        description: 'A visible cloud of water droplets condensed because air pressure inside the rotating vortex core drops by up to one hundred millibars relative to ambient surroundings.',
        fact: 'Wind velocities inside the most intense tornadoes can exceed four hundred eighty kilometers per hour, producing the fastest wind speeds measured on Earth surface.'
      },
      {
        id: 'wall',
        name: 'Mesocyclone Rotating Wall Cloud',
        sub: 'Parent Supercell Updraft Base',
        position: [0.0, 1.8, 0.0],
        description: 'The lowered, rotating cloud base beneath the main precipitation-free updraft of a supercell thunderstorm where warm, humid air converges and feeds into the vortex.',
        fact: 'Supercell thunderstorms that produce violent tornadoes can rise over fifteen kilometers into the atmosphere, penetrating into the stratosphere.'
      },
      {
        id: 'debris',
        name: 'Surface Debris Ring Vortex',
        sub: 'Ground Shearing Boundary Layer',
        position: [0.0, -2.1, 0.0],
        description: 'A chaotic swirl of soil, vegetation, and pulverized debris hurled radially outwards by intense ground-level boundary layer suction and centrifugal force.',
        fact: 'Most damage produced by tornadoes is caused by high-velocity wind drag combined with airborne debris traveling at hundreds of kilometers per hour.'
      }
    ]
  },

  wing: {
    specimenId: 'wing',
    scientificName: 'Ala Avis Aerodynamica',
    category: 'Zoology',
    overview: 'The biological airfoil that powers avian flight. The bird wing integrates hollow pneumatic bones, articulated wrist and finger joints, and slotted flight feathers that produce both lift and forward thrust.',
    hotspots: [
      {
        id: 'primaries',
        name: 'Slotted Primary Flight Remiges',
        sub: 'Aerodynamic Thrust Generators',
        position: [2.0, 0.0, -0.8],
        description: 'Ten stiff, asymmetric flight feathers attached to the manus hand bones that twist during downstrokes like miniature propeller blades to generate forward thrust.',
        fact: 'Soaring birds spread their primary wingtip feathers like fingers to create slots that break up drag-inducing wingtip vortices and conserve flight energy.'
      },
      {
        id: 'secondaries',
        name: 'Secondary Remiges & Airfoil Camber',
        sub: 'Sustained Lift Surfaces',
        position: [-0.2, -0.2, -0.9],
        description: 'Flight feathers anchored along the ulna bone that form the arched camber of the inner wing, accelerating airflow across the curved upper surface to generate lift.',
        fact: 'Bird flight feathers interlock via microscopic hooks called barbules that zip together, allowing birds to groom ruffled feathers back into smooth airfoils.'
      },
      {
        id: 'humerus',
        name: 'Pneumatic Avian Skeleton',
        sub: 'Hollow Strut Architecture',
        position: [-1.5, 0.2, 0.1],
        description: 'Lightweight hollow bones filled with internal air sacs and crisscrossed internal bone struts, providing structural rigidity while minimizing flight mass.',
        fact: 'A bald eagle wingspan can exceed two meters, yet its entire skeleton weighs less than three hundred grams, lighter than its plumage of feathers.'
      }
    ]
  }
};

